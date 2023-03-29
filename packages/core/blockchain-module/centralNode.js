import {Block} from "./block.js";
import express from "express";
import axios from 'axios';
import Redis from "redis";
import { Blockchain } from "./blockchain.js";
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';
import { Mempool } from "./mempool.js";
import { Form } from "./forms.js";
import { Transaction } from "./transaction.js";

const myNode = express();
myNode.use(express.json());
myNode.use(express.urlencoded({extended:false}));

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

myNode.get('/mempool', function (req, res) {
    res.send(deGatherMempool);
});

myNode.get('/blockchain', function (req, res) {
    res.send(deGatherBlockchain);
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
    if(transactionForm instanceof Transaction){
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
    const verifiedMempool = req.headers.verifiedmempool;
    const stake = req.headers.stake;
    consensusMempool.push(verifiedMempool);
    consensusStake.push(stake);
    res.send("All Mempool Collected");
});

function collectAllMempool(){
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
        consensusTransaction();
    });
}
function consensusTransaction(){
    var consensusResult = [];
    //logic
    var transactions = [];
    consensusMempool.forEach(element => {
        consensusMempool.transactionCache 
    });
    deGatherBlockchain.pendingBlock.transactions = consensusResult;
}

function sendPendingAndMintBlock(){
    const requestPromises = [];
        registeredNetwork.forEach(node=>{
            if(node != centralNodeUrlOffline){
                const requestOptions ={
                    url: "http:"+ node + "/newFormPendingTransaction",
                    method:"POST",
                    data : {
                        transaction : transactionForm,
                    }
                };
                requestPromises.push(axios(requestOptions));
            }
        })
        Promise.all(requestPromises).then(data=>{
            return res.json({
                note : "Form created and broadcasted successfully",
                code:0,
            });
        });

    deGatherBlockchain.mintBlock();
    //broadcast logic and mint
}

myNode.listen(centralNodePort,()=>{
    console.log(`Running on port `+centralNodePort);
});
IPUpdate();
checkMempool();
