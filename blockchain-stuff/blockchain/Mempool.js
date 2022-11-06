import crypto from "crypto"
import { deGatherBlockchain } from "./Block.js";

export class Mempool{
    constructor(){
        this.transactionCache = [];
        this.responsesCache = [];
        this.verifiedTransactions = [];
    }
    verifyAllTransaction(){
        //verify all created surveys
        while(this.transactionCache.length!=0){
            var surveyData = this.transactionCache[0].surveyID+
            this.transactionCache[0].authorID+
            this.transactionCache[0].fee+
            this.transactionCache[0].totalRewards+
            this.transactionCache[0].targetParticipant+
            this.transactionCache[0].onceOnly+
            this.transactionCache[0].responses;
            const verify = crypto.createVerify('SHA256');
            verify.write(surveyData);
            verify.end();
            if(verify.verify(this.transactionCache[0].authorID, this.transactionCache[0].authorSignature, 'hex')){
                this.verifiedTransactions.push(this.transactionCache[0]);   
            }
            this.transactionCache.splice(0,1);
        }
        /*for(let i=0;i<this.transactionCache.length;i++){
            var surveyData = this.transactionCache[i].surveyID+
            this.transactionCache[i].authorID+
            this.transactionCache[i].fee+
            this.transactionCache[i].totalRewards+
            this.transactionCache[i].targetParticipant+
            this.transactionCache[i].onceOnly+
            this.transactionCache[i].responses;
            const verify = crypto.createVerify('SHA256');
            verify.write(surveyData);
            verify.end();
            if(verify.verify(this.transactionCache[i].authorID, this.transactionCache[i].authorSignature, 'hex')){
                this.verifiedTransactions.push(this.transactionCache[i]);
                this.transactionCache.splice(i,1);
            }else{
                this.transactionCache.splice(i,1);
            }
        }*/
        //verify all pending responses
        for(let i=0;i<this.responsesCache.length;i++){
            var responseData = this.responsesCache[i][1].answers+
            this.responsesCache[i][1].responseID+
            this.responsesCache[i][1].responseUserID;
            const verify = crypto.createVerify('SHA256');
            verify.write(responseData);
            verify.end();
            if(verify.verify(this.responsesCache[i][1].responseUserID, this.responsesCache[i][1].responseSignature, 'hex')){
                var counter = 0;
                //finding same survey in validated survey the just push
                for(let j=0;j<this.verifiedTransactions.length;j++){
                    counter++;
                    if(this.verifiedTransactions[j].surveyID==this.responsesCache[i][0]){
                        this.verifiedTransactions[j].responses.push(this.responsesCache[i][1]);
                        this.responsesCache.splice(i,1);
                        break;
                    }
                }
                //if not founded then find that survey creation and create then push the response
                if(counter==this.verifiedTransactions.length){
                    var theSurvey = this.findExistingSurveyByID(this.responsesCache[i][0]);
                    theSurvey.responses.push(this.responsesCache[i][1]);
                    this.verifiedTransactions.push(theSurvey);
                    this.responsesCache.splice(i,1);
                }
            }else{
                this.responsesCache.splice(i,1);
            }
        }
    }
    findExistingSurveyByID(surveyID){
        var block = deGatherBlockchain.getLatestBlock();
        if(block.index==0){
            return null;
        }
        if(block.transactions.length!=0){
            for(let i=0;i<block.transactions.length;i++){
                if(block.transactions[i].surveyID==surveyID){
                    return block.transactions[i];
                }
            }
            return this.findExistingSurvey(block.getPrevBlock());
        }
        return this.findExistingSurvey(block.getPrevBlock());
    }
    fillPendingBlock(){
        deGatherBlockchain.pendingBlock.transactions = this.verifiedTransactions;
        this.verifiedTransactions = [];
    }
}

export var deGatherMempool = new Mempool();

