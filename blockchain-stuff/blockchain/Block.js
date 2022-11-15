import crypto from "crypto"

import {Blockchain} from "./deGatherBlockchain.js";
import { Form } from "./Form.js";
import { deGatherMempool } from "./Mempool.js";
import { Response } from "./Response.js";

export class Block{
    constructor(index,transactions=[],previousHash=""){
        this.index = index;
        this.timestamp = "Pending";
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        var blockData = this.previousHash+this.timestamp+JSON.stringify(this.transactions);
        const hash = crypto.createHash("sha256").update(blockData).digest("base64");
        return hash.toString();
    }
    setTimeStamp(){
        this.timestamp = Date.now().toString();
    }
    /*
    createResponse(surveyID,answers,responseUserID,privateKey){
        var blockData = answers+surveyID+responseUserID;
        const hashID = crypto.createHash("sha256").update(blockData).digest("base64");
        var newResponse = new Response(answers,hashID.toString(),responseUserID,privateKey);
        deGatherMempool.responsesCache.push([surveyID,newResponse]);
        return newResponse;
    }*/
    createNewForm(authorID,authorPublicKey,fee,totalRewards,participantsCountTarget,onceOnly,authorPrivateKey){
        var formID = this.generateFormID();
        var newForm = new Form(formID,authorID,authorPublicKey,fee,totalRewards,participantsCountTarget,onceOnly,authorPrivateKey);
        deGatherBlockchain.pendingBlock.transactions.push(newForm);
        deGatherBlockchain.mintBlock();
        return newForm;
    }
    generateFormID(){
        if(deGatherBlockchain.getLatestBlock().index==0){
            return 0;
        }else{
            return deGatherBlockchain.getLatestBlock().transactions[0].id +1;
        }
    }

    /*
    findSurveyID(){
        for(let i=deGatherMempool.transactionCache.length-1;i>=0;i--){
            if(deGatherMempool.transactionCache[i].responses.length==0){
                return deGatherMempool.transactionCache[i].surveyID+1;
            }
        }
        return this.findLastSurveyCreated(deGatherBlockchain.pendingBlock);
    }
    findLastSurveyCreated(block){
        //base case where if current block is genesis block then no more
        if(block.index==0){
            return 0;
        }
        
        if(block.transactions.length!=0){//check if current transaction not empty to find latest survey creation
            for(var i=block.transactions.length-1;i>=0;i--){//find backwards
                if(block.transactions[i].responses.length==0){//check if current transaction have create survey
                    return block.transactions[i].surveyID+1;//set current survey id to last created survey id +1
                }
            }
            if(block === deGatherBlockchain.pendingBlock){
                return this.findLastSurveyCreated(deGatherBlockchain.getLatestBlock());
            }else{
                return this.findLastSurveyCreate(block.getPrevBlock());
            }
            
        }
        if(block === deGatherBlockchain.pendingBlock){
            return this.findLastSurveyCreated(deGatherBlockchain.getLatestBlock());
        }else{
            return this.findLastSurveyCreate(block.getPrevBlock());
        }
    }*/
    getPrevBlock(){
        return this.deGatherBlockchain[this.index-1];
    }
    
}

export var deGatherBlockchain = new Blockchain();