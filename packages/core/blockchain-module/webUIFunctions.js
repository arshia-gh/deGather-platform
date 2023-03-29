import crypto from "crypto"
import { Form } from "./forms";
import { Transaction } from "./transaction";
import { Wallet } from "./wallet.js";

function createWallet(privateKey){
    var theWallet = new Wallet(privateKey,blockchain);
}

function createFormTransaction(formField, wallet,fee){
    var newForm = new Form();
    var newTransaction = new Transaction(wallet.publicKey,"0x00",fee,newForm,wallet.privateKey);
    return newTransaction;
}