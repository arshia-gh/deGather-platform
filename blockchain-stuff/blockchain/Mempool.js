import crypto from "crypto"
import { deGatherBlockchain } from "./Block.js";

const currentNodeUrl = process.argv[3];


export class Mempool{
    constructor(){
        this.transactionCache = [];
        this.responsesCache = [];
        this.verifiedTransactions = [];
        this.currentNodeUrl = currentNodeUrl;
        this.networkNodes = [];
    }
    verifyAllPendingTransactions(){
        //verify all created surveys
        while(this.transactionCache.length!=0){
            var surveyData = this.transactionCache[0].surveyID+
            this.transactionCache[0].authorID+
            this.transactionCache[0].fee+
            this.transactionCache[0].totalRewards+
            this.transactionCache[0].targetParticipant+
            this.transactionCache[0].onceOnly;
            const verify = crypto.createVerify('SHA256');
            verify.write(surveyData);
            verify.end();
            if(verify.verify(this.transactionCache[0].authorID, this.transactionCache[0].authorSignature, 'hex')){
                this.verifiedTransactions.push(this.transactionCache[0]);   
            }
            this.transactionCache.splice(0,1);
        }
        //verify all pending responses
        while(this.responsesCache.length!=0){
            var responseData = this.responsesCache[0][1].answers+
            this.responsesCache[0][1].responseID+
            this.responsesCache[0][1].responseUserID;
            const verify = crypto.createVerify('SHA256');
            verify.write(responseData);
            verify.end();
            if(verify.verify(this.responsesCache[0][1].responseUserID, this.responsesCache[0][1].responseSignature, 'hex')){
                var counter = 0;
                //finding same survey in validated survey the just push
                for(let i=0;i<this.verifiedTransactions.length;i++){
                    counter++;
                    if(this.verifiedTransactions[i].surveyID==this.responsesCache[0][0]){
                        this.verifiedTransactions[i].responses.push(this.responsesCache[0][1]);
                        this.responsesCache.splice(0,1);
                        break;
                    }
                }
                //if not founded then find that survey creation and create then push the response
                if(counter==this.verifiedTransactions.length){
                    var theSurvey = this.findExistingSurveyByID(this.responsesCache[0][0],deGatherBlockchain.pendingBlock);
                    theSurvey.responses.push(this.responsesCache[0][1]);
                    this.verifiedTransactions.push(theSurvey);
                    this.responsesCache.splice(0,1);
                }
            }else{
                this.responsesCache.splice(0,1);
            }
        }
    }
    findExistingSurveyByID(surveyID,block){
        if(block.index==0){
            return null;
        }
        if(block.transactions.length!=0){
            for(let i=0;i<block.transactions.length;i++){
                if(block.transactions[i].surveyID==surveyID){
                    return block.transactions[i];
                }
            }
            if(block = deGatherBlockchain.pendingBlock){
                return this.findExistingSurveyByID(surveyID,deGatherBlockchain.getLatestBlock());
            }else{
                return this.findExistingSurveyByID(block.getPrevBlock());
            }
        }
        if(block = deGatherBlockchain.pendingBlock){
            return this.findExistingSurveyByID(surveyID,deGatherBlockchain.getLatestBlock());
        }else{
            return this.findExistingSurveyByID(block.getPrevBlock());
        }
    }
    fillPendingBlock(){
        var verifiedTransactions = this.verifiedTransactions;
        deGatherBlockchain.consensusMempool.push(this.verifiedTransactions);
        this.verifiedTransactions = [];
        return verifiedTransactions;
    }
}

export const deGatherMempool = new Mempool();

