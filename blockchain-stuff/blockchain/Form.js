import crypto from "crypto"
import {Response} from "./Response.js"
export class Form{
    constructor(id,authorID,authorPublicKey,fee,totalRewards,participantsCountTarget,onceOnly,authorPrivateKey){
        this.id = id;
        this.authorID = authorID;
        this.authorPublicKey = authorPublicKey;
        this.fee = fee;
        this.totalRewards = totalRewards;
        this.participantsCountTarget = participantsCountTarget;
        this.onceOnly=onceOnly;//boolean same user multiple response on survey
        const sign = crypto.createSign('SHA256');
        var surveyData = this.id+this.authorPublicKey+this.fee+this.totalRewards+this.participantsCountTarget+this.onceOnly;
        sign.write(surveyData);
        sign.end();
        const signature = sign.sign(authorPrivateKey, 'hex');
        this.authorSignature = signature;
    }
    
}