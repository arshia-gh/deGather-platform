import crypto from "crypto"
import {Response} from "./Response.js"
export class Survey{
    constructor(surveyID,authorID,fee,totalRewards,targetParticipant,onceOnly,privateKey){
        this.surveyID = surveyID;
        this.authorID = authorID;
        this.fee = fee;
        this.totalRewards = totalRewards;
        this.targetParticipant = targetParticipant;
        this.onceOnly=onceOnly;//boolean same user multiple response on survey
        this.responses=[];
        const sign = crypto.createSign('SHA256');
        var surveyData = this.surveyID+this.authorID+this.fee+this.totalRewards+this.targetParticipant+this.onceOnly+this.responses;
        sign.write(surveyData);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');
        this.authorSignature = signature;
    }
    
}