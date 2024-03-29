import { Form } from "./forms";

export class historyBook{

    smartContractAddress = "0x00";

    constructor(blockchain){
        this.transactionList =[];
        this.formList = [];
        this.nftList = [];
        this.userList = [];
        this.smartContractList = [];// static
        this.loadData(blockchain)
    }
    loadData(blockchain){
        blockchain.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                //forHistoryBook
                this.transactionList.push(transaction);
                if(transaction.data instanceof Form){
                    this.formList.push(transaction.data);
                }
                //createNewSender or get existing sender
                if(transaction.sender!=this.smartContractAddress){
                    var userSender = new User(transaction.sender);
                    var isNewUser = true;
                    for(var i=0;i<this.userList.length;i++){
                        if(this.userList[i].address == userSender){
                            userSender = this.userList[i];
                            isNewUser = false;
                        }
                    }
                    userSender.transactionList.push(transaction);
                    userSender.spend(transaction.creditAmount);
                    if(transaction.data instanceof Form){
                        userSender.formList.push(transaction.data);
                    }
                    //update or insert to historyBook
                    if(isNewUser){
                        this.userList.push(userSender);
                    }else{
                        for(var i=0;i<this.userList.length;i++){
                            if(this.userList[i].address==userSender.address){
                                this.userList[i] = userSender;
                                break;
                            }
                        }
                    }
                }
                //createNewReceiver or get existing receiver
                if(transaction.receiver!=this.smartContractAddress){
                    var userReceiver = new User(transaction.receiver);
                    var isNewUser = true;
                    for(var i=0;i<this.userList.length;i++){
                        if(this.userList[i].address == userReceiver){
                            userReceiver = this.userList[i];
                            isNewUser = false;
                        }
                    }
                    userReceiver.transactionList.push(transaction);
                    userReceiver.gain(transaction.creditAmount);
                    //update or insert to historyBook
                    if(isNewUser){
                        this.userList.push(userReceiver);
                    }else{
                        for(var i=0;i<this.userList.length;i++){
                            if(this.userList[i].address==userReceiver.address){
                                this.userList[i] = userReceiver;
                                break;
                            }
                        }
                    }
                }
            });
        });
    }
}
export class User{
    constructor(address){
        this.address = address;
        this.creditAmount = 0;
        this.transactionHistory = [];
        this.nftList = [];
        this.formList = [];
        this.responseList = [];
    }
    spend(credit){
        this.creditAmount-=credit;
    }
    gain(credit){
        this.creditAmount+=credit;
    }

}