import {Block} from "./block.js";
import express from "express";
import axios from 'axios';
import Redis from "redis";
import { Blockchain } from "./blockchain.js";
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';
import { Mempool } from "./mempool.js";
import { Form } from "./forms.js";
import { Transaction } from "./transaction.js";
import { HistoryBook } from "./historyBook.js";
import bodyParser from "body-parser";

const myNode = express();
myNode.use(express.json());             // for application/json
myNode.use(express.urlencoded({ extended: true }));
myNode.use(bodyParser.json());
myNode.use(bodyParser.urlencoded({ extended: true }));


var deGatherBlockchain = new Blockchain();
var deGatherMempool = new Mempool();
var centralNodePort = 8000;
var centralNodeUrlOffline = "localhost:"+centralNodePort;
var centralNodeUrl = await publicIpv4()+":"+centralNodePort;

var registeredNetwork = [centralNodeUrlOffline];
var activeNetwork = [];
var inactiveNetwork = [];

var consensusMempool = [];
var consensusStake = [];
var consensusMempoolOwner =[];

function putInactive(){
    console.log("Check Inactive...");
    inactiveNetwork.forEach(inactiveNode => {
        var index = registeredNetwork.indexOf(inactiveNode);
        console.log("Node disconnected : "+inactiveNode)
        registeredNetwork.splice(index,1);
    });
    inactiveNetwork=[];
    registeredNetwork.forEach(node => {
        if(!activeNetwork.indexOf(node)){
            var index = activeNetwork.indexOf(node);
            activeNetwork.splice(index,1);
            inactiveNetwork.push(node);
        }
    });
}

function IPUpdate(){
    console.log("Current IP : "+centralNodeUrlOffline);
    setInterval(async ()=>{
        centralNodeUrl = await publicIpv4()+":"+centralNodePort;
        putInactive();
    },1000*60);
}
function checkMempool(){
    var timer = 0;
    var session = false;
    setInterval(async ()=>{
        if(deGatherMempool.transactionCache.length!=0||deGatherMempool.verifiedTransactions.length!=0){
            if(timer==0&!session){
                timer = 60*3;
                session = true;
                console.log("Session Started");
            }
        }
        if(session){
            if(timer>0){
                timer--;
            }else{
                session=false;
                console.log("Session Ended");
                //do consensus here
                collectAllMempool();
            }
        }
    },1000);
}

myNode.get('/userBalance', function (req, res) {
    var publicKey = req.body.publicKey;
    var historyBook = new HistoryBook(deGatherBlockchain);
    var userPublicWallet = historyBook.publicWallet(publicKey);
    res.send(userPublicWallet.getCurrentCredit());
});
myNode.get('/userPublishedForms', function (req, res) {
    var publicKey = req.body.publicKey;
    var historyBook = new HistoryBook(deGatherBlockchain);
    var userPublicWallet = historyBook.publicWallet(publicKey);
    res.send(userPublicWallet.formList);
});
myNode.get('/userResponses', function (req, res) {
    var publicKey = req.body.publicKey;
    var historyBook = new HistoryBook(deGatherBlockchain);
    var userPublicWallet = historyBook.publicWallet(publicKey);
    res.send(userPublicWallet.responseList);
});
myNode.get('/publishedForms', function (req, res) {
    var historyBook = new HistoryBook(deGatherBlockchain);
    res.send(historyBook.formList);
});
myNode.get('/formResponses/:id', function (req, res) {
    var formID = req.body.id;
    var historyBook = new HistoryBook(deGatherBlockchain);
    var responses;
    historyBook.formList.forEach(form => {
        if(form.id==formID){
            responses=form.responses;
        }
    });
    res.send(responses);
});
myNode.get('/transactions', function (req, res) {
    var historyBook = new HistoryBook(deGatherBlockchain);
    res.send(historyBook.transactionList);
});

myNode.get('/pendingTransactions', function (req, res) {
    res.send(deGatherMempool.transactionCache);
});
myNode.get('/validatorsCount', function (req, res) {
    res.send(registeredNetwork.length-1);
});
myNode.get('/userCount', function (req, res) {
    var historyBook = new HistoryBook(deGatherBlockchain);
    res.send(historyBook.userList.length);
});
myNode.get('/transactions/:index', function (req, res) {
    var blockIndex = req.body.index;
    res.send(deGatherBlockchain.chain[formIndex]);
});

myNode.get('/mempool', function (req, res) {
    res.send(deGatherMempool);
});

myNode.get('/blockchain', function (req, res) {
    res.send(deGatherBlockchain);
});

myNode.get('/consensus', function (req, res) {
    res.send({
        consensusMempool,
        consensusMempoolOwner,
        consensusStake,
    });
});

myNode.get('/validatorNetwork',function (req, res) {
    var validatorNetworkState = {
        registeredNetwork : registeredNetwork,
        activeNetwork : activeNetwork,
        inactiveNetwork : inactiveNetwork,
    };
    res.send(validatorNetworkState);
});
myNode.post("/pingActive",function(req,res){
    const newNodeUrl = req.headers.newnodeurl;
    if(registeredNetwork.indexOf(newNodeUrl)!=-1){
        if(activeNetwork.indexOf(newNodeUrl)==-1){
            activeNetwork.push(newNodeUrl);
            var index = inactiveNetwork.indexOf(newNodeUrl);
            if(index!=-1){
                inactiveNetwork.splice(index,1);
            }
        }
        res.statusCode = 200;
    }else{
        res.statusCode = 404;
    }
    res.send("Pinged");
});
myNode.post("/register-node",function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlrPresent = registeredNetwork.indexOf(newNodeUrl) == -1;
    const notCurrentNode = centralNodeUrl !== newNodeUrl;
    if(nodeNotAlrPresent&&notCurrentNode){
        registeredNetwork.push(newNodeUrl);
    }
    return res.json({note : "New Node Registered successfully"});
});


myNode.post('/register-and-broadcast-node', function (req, res) {
    console.log("New node : "+req.headers.newnodeurl);
    const newNodeUrl = req.headers.newnodeurl;
    
    // if (registeredNetwork.indexOf(newNodeUrl) == -1&&newNodeUrl!=centralNodeUrlOffline) { // -1 Means the item is not available inside the array
    //     registeredNetwork.push(newNodeUrl);
    // }
    const regNodesPromiess = [];
    registeredNetwork.forEach(networkNodeUrl => {
        const requestOptions = {
            url: "http://"+networkNodeUrl + '/register-node',
            method: "POST",
            data: { newNodeUrl: newNodeUrl }
        };
        regNodesPromiess.push(axios(requestOptions));
    });
    Promise.all(regNodesPromiess).then(data => {
        const bulkRegisterOptions = {
            url: "http://"+newNodeUrl + "/register-node-bulk",
            method: "POST",
            data: {
                allNetworkNodes: [...registeredNetwork, centralNodeUrlOffline]
            }
        };
        return axios(bulkRegisterOptions);
    }).then(data => {
        return res.json({ note: 'New node registered with the network successfully' });
    });
});
myNode.post("/newFormPendingTransaction", function (req, res){
    var transaction = req.body.transaction;
    deGatherMempool.transactionCache.push(transaction);
    res.send("Transaction added to Mempool");
});
myNode.post('/broadcastForm', function (req, res) {
    var transactionForm = req.body.transaction;
    if(true){
        const requestPromises = [];
        registeredNetwork.forEach(node=>{
            const requestOptions ={
                url: "http:"+ node + "/newFormPendingTransaction",
                method:"POST",
                data : {
                    transaction : transactionForm,
                }
            };
            requestPromises.push(axios(requestOptions));
        })
        Promise.all(requestPromises).then(data=>{
            return res.json({
                note : "Form created and broadcasted successfully",
                code:0,
            });
        });
    }else{
        res.json({
            note : "Format not correct!",
            code:-1,
        });
    }
});
myNode.post('/collectVerifiedMempool', function (req, res) {
    const verifiedMempool = req.body.verifiedMempool;
    const stake = req.body.stake;
    const owner = req.body.owner;
    consensusMempool.push(verifiedMempool);
    consensusStake.push(stake);
    consensusMempoolOwner.push(owner);
    res.send("success");
    consensusTransaction();
    
});

myNode.get('/historyBook', function (req, res) {
    var historyBook = historyBook(deGatherBlockchain);
    res.send(historyBook);
})
var networkConsensus = 0;
function collectAllMempool(){
    var requestPromises = [];
    deGatherMempool.validateAllTransaction();
    registeredNetwork.forEach(node=>{
        if(node != centralNodeUrlOffline){
            const requestOptions ={
                url: "http:"+ node + "/submitVerifiedMempool",
                method:"POST",
            };
            requestPromises.push(axios(requestOptions));
        }
    })
    Promise.all(requestPromises).then(data=>{
        networkConsensus=requestPromises.length;
    });
}
function consensusTransaction(){
    if(consensusMempool.length!=networkConsensus){
        return;
    }
    // var consensusResult = [];
    // //logic
    // var transactions = [deGatherMempool.verifiedTransactions];
    // var transactionCount = [];
    // var ownerViolationRate = [];
    // for (var i=0;i<consensusMempoolOwner.length;i++){
    //     ownerViolationRate.push(0);
    // }
    // for(var i=0;i<deGatherMempool.verifiedTransactions.length;i++){
    //     transactionCount.push(0);
    // }
    // for(var i=0;i<consensusMempool.length;i++){
    //     consensusMempool[i].forEach(transaction => {
    //         if(transactions.indexOf(transaction)!=-1){
    //             transactionCount[transactions.indexOf(transaction)] +=1;
    //         }else{
    //             transactions.push(transaction);
    //             transactionCount.push(1);
    //         }
    //     });
    // }
    // for(var i=0;i<transactions.length;i++){
    //     if(transactionCount[i]>(registeredNetwork.length-1)/2){
    //         consensusResult.push(transactions[i]);
    //     }else if(transactionCount[i]<=(registeredNetwork.length-1)/10){
    //         var ownerIndex = findTransactionOwner(transactions[i]);
    //         ownerViolationRate[ownerIndex] += 1;
    //     }
    // }
    // for(var i=0;i<ownerViolationRate.length;i++){
    //     if(ownerViolationRate[i]/(consensusMempool[i].length)*100 >= 20 ){
    //         //give all the stake as the transaction fee as reward to others validator
    //     }
    // }
    
    consensusMempool=[];
    consensusStake=[];
    consensusMempoolOwner=[];
    deGatherBlockchain.fillPendingBlock(deGatherMempool.verifiedTransactions);
    sendPendingAndMintBlock(deGatherMempool.verifiedTransactions);
    deGatherMempool.verifiedTransactions=[];
    // deGatherBlockchain.fillPendingBlock(consensusResult);
    // sendPendingAndMintBlock(consensusResult);
}

function findTransactionOwner(transactionArgs){
    for(var i=0;i<consensusMempool.length;i++){
        consensusMempool[i].forEach(transaction => {
            if(transactionArgs==transaction){
                return i;
            }
        });
    }
}

function sendPendingAndMintBlock(consensusResult){
    const requestPromises = [];
        registeredNetwork.forEach(node=>{
            if(node != centralNodeUrlOffline){
                const requestOptions ={
                    url: "http:"+ node + "/newFormPendingBlock",
                    method:"POST",
                    data : {
                        pendingBlockTransaction : consensusResult, 
                    }
                };
                requestPromises.push(axios(requestOptions));
            }
        })
        Promise.all(requestPromises).then(data=>{
            console.log("New block creation instructed!");
        });

    deGatherBlockchain.mintBlock();
    //broadcast logic and mint
}

myNode.listen(centralNodePort,()=>{
    console.log(`Running on port `+centralNodePort);
});
IPUpdate();
checkMempool();
