import { Form } from "./forms.js";
import { Transaction } from "./transaction.js";
import crypto from "crypto"

export class Mempool{
    constructor(){
        this.transactionCache = [];
        this.verifiedTransactions = [];
        this.unverifiedTransaction = [];
    }
    validateAllTransaction(){
        this.transactionCache.forEach(transaction => {
            var transactionData = transaction.sender+transaction.receiver+transaction.creditAmount+
            transaction.timestamp+JSON.stringify(transaction.data)+transaction.txID+transaction.senderPublicKey;
            const verify = crypto.createVerify('SHA256');
            verify.write(transactionData);
            verify.end();
            if(verify.verify(transaction.senderPublicKey, transaction.signature, 'hex')){
                this.verifiedTransactions.push(transaction);   
            }else{
                this.unverifiedTransaction.push(transaction);  
            }
            this.transactionCache = [];
        });
    }
}