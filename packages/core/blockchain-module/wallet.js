import { Transaction } from "./transaction";
import crypto from "crypto"

export class Wallet{
    constructor(privateKey,publicKey){
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.transactionHistory = [];
        this.nftList = [];
        this.formList = [];
        this.responseList = [];
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
    // getAddress(){
    //     var addressRaw = crypto.createHash("sha256").update(this.privateKey).digest("base64");
    //     var address = addressRaw.toString().slice(0, 20);
    //     return address;
    // }
}