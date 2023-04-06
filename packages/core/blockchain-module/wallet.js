import { Form } from "./forms";
import { Response } from "./response";
import { Transaction } from "./transaction";
import crypto from "crypto"

export class Wallet{
    constructor(privateKey,blockchain){
        this.privateKey = privateKey;
        this.publicKey = this.getPublicKey();
        this.address = this.getAddress();
        this.transactionHistory = [];
        this.nftList = [];
        this.formList = [];
        this.responseList = [];
        this.getWalletData(blockchain);
    }
    constructor(){
        this.privateKey = "";
        this.publicKey ="";
        this.address = "";
        this.transactionHistory = [];
        this.nftList = [];
        this.formList = [];
        this.responseList = [];
    }
    parseKey(base64Key){
        return Buffer.from(base64Key, "base64").toString("ascii");
    }
    getWalletData(blockchain){
        blockchain.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if(transaction.sender==this.address||transaction.receiver==this.address){
                    this.transactionHistory.push(transaction);
                    if(transaction.sender==this.address&&transaction.data instanceof Form){
                        this.formList.push(transaction.data);
                    }
                    if(transaction.sender==this.address&&transaction.data instanceof Response){
                        this.formList.push(transaction.data);
                    }
                }
            });
        });
    }
    getCurrentCredit(){
        var tempCredit = 0;
        this.transactionHistory.forEach(transaction => {
            if(tempCredit>=0){
                if(transaction.sender == this.address){
                    tempCredit -= transaction.amount;
                }else if(transaction.receiver == this.address){
                    tempCredit += transaction.amount;
                }
            }
        });
        return tempCredit;
    }
    getPublicKey(privateKey){
        const pubKeyObject = crypto.createPublicKey({
            key: privateKey,
            format: 'pem'
        })
        
        const publicKey = pubKeyObject.export({
            format: 'pem',
            type: 'spki'
        })
        return publicKey;
    }
    getAddress(){
        var addressRaw = crypto.createHash("sha256").update(this.getPublicKey(this.privateKey)).digest("base64");
        var address = addressRaw.toString().slice(0, 40);
        return address;
    }
}