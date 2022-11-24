import crypto from "crypto"
import {Block} from "./Block.js";
import { deGatherBlockchain } from "./Block.js";
export class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.pendingBlock = null;
        this.consensusMempool = [];
        this.createPendingBlock();
    }
    createGenesisBlock(){
        return new Block(0,"Genesis Block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    createPendingBlock(){
        var newBlock = new Block(this.getLatestBlock().index+1,[],this.getLatestBlock().hash);
        this.pendingBlock = newBlock;
    }
    mintBlock(){
        this.pendingBlock.setTimeStamp();
        this.pendingBlock.hash = this.pendingBlock.calculateHash();
        this.chain.push(this.pendingBlock);
        this.createPendingBlock();
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== prevBlock.hash ){
                return false;
            }
            if(!this.checkTransactionVerification(currentBlock)){
                return false;
            }
        }
        return true;
    }
    consensusTransaction(){
        var transactionCount = [];
        var transactions = [];
        deGatherBlockchain.consensusMempool.forEach(mempool => {
            mempool.forEach(transaction=>{
                var indexNo = -1;
                for(var i=0;i<transactions.length;i++){
                    if(transaction.authorSignature==transactions[i].authorSignature){
                        indexNo=i;
                    }
                }
                if(indexNo==-1){
                    transactions.push(transaction);
                    transactionCount.push(1);
                }else{
                    transactionCount[indexNo]++;
                }
            });
        });
        for(var i=0;i<transactions.length;i++){
            if(transactionCount[i]>=transactions.length/2){
                deGatherBlockchain.pendingBlock.transactions.push(transactions[i]);
            }
        }
        deGatherBlockchain.consensusMempool=[];
    }
    checkTransactionVerification(thisBlock){
        for(var i=0;i<thisBlock.transactions.length;i++){
            var surveyData = thisBlock.transactions[i].surveyID+
            thisBlock.transactions[i].authorID+
            thisBlock.transactions[i].fee+
            thisBlock.transactions[i].totalRewards+
            thisBlock.transactions[i].targetParticipant+
            thisBlock.transactions[i].onceOnly;
            const verify = crypto.createVerify('SHA256');
            verify.write(surveyData);
            verify.end();
            if(!verify.verify(thisBlock.transactions[i].authorID, thisBlock.transactions[i].authorSignature, 'hex')){
                return false;
            }
            for(var j=0;j<thisBlock.transactions[i].responses.length;j++){
                var responseData = thisBlock.transactions[i].responses[j].answers+
                thisBlock.transactions[i].responses[j].responseID+
                thisBlock.transactions[i].responses[j].responseUserID;
                const verify = crypto.createVerify('SHA256');
                verify.write(responseData);
                verify.end();
                if(!verify.verify(thisBlock.transactions[i].responses[j].responseUserID,
                    thisBlock.transactions[i].responses[j].responseSignature, 'hex')){
                    return false;
                }
            }
        }
        return true;
    }
}
