import crypto from "crypto"
import { Form } from "./forms.js";

export class Transaction{
    constructor(senderAddress,receiverAddress,amount,data="",authorPrivateKey,senderPublicKey) {
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.creditAmount = amount;
        this.timestamp = new Date.now().toString();
        this.data = data;
        this.txID = generateID();
        this.senderPublicKey = senderPublicKey;
        this.signature = this.generateSignature(authorPrivateKey);
    }
    generateID(){
        var transactionData = this.sender+this.receiver+this.creditAmount+this.timestamp+JSON.stringify(this.data);
        const hash = crypto.createHash("sha256").update(transactionData).digest("base64");
        const hash2 =  crypto.createHash("sha256").update(hash.toString()).digest("base64");
        return hash2.toString();
    }
    parseKey(base64Key){
        return Buffer.from(base64Key, "base64").toString("ascii");
    }
    generateSignature(authorPrivateKey){
        const sign = crypto.createSign('SHA256');
        var transactionData = this.sender+this.receiver+this.creditAmount+this.timestamp+JSON.stringify(this.data)+this.txID+this.senderPublicKey;
        sign.write(transactionData);
        sign.end();
        const signature = sign.sign(this.parseKey(authorPrivateKey), 'hex');
        return signature;
    }
}