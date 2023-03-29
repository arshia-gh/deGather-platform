import {Block} from "../block.js";
import express from "express";
import axios from 'axios';
import Redis from "redis";
import { Blockchain } from "../blockchain.js";
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';

import * as http from 'http'; //ES 6
import { Mempool } from "../mempool.js";
import { Form } from "../forms.js";
import { Transaction } from "../transaction.js";

export const myNode = express();
myNode.use(express.json());
myNode.use(express.urlencoded({extended:false}));


var centralNodeUrl = "localhost";
var centralNodePort = 8000;
var theBlockchain = new Blockchain();
var theMempool = new Mempool();
var myPort = 7000;
var myNodeUrl = await publicIpv4()+":"+myPort;
var myNodeUrlOffline = "localhost:"+myPort;

var connected = false;

var registeredNetwork = [myNodeUrlOffline];

export function changePort(portInput){
    myPort = portInput;
    myNodeUrlOffline = "localhost:"+myPort;
    return myPort;
}

export function runLivePing(){
    pingActive();
    console.log("Current IP : "+myNodeUrlOffline);
    var timer = 0;
    setInterval(async ()=>{
        connectedCheck();
        if(connected){
            if(timer==0){
                console.log("Connected to validator network");
            }
            if(timer%60==0){
                myNodeUrl = await publicIpv4()+":"+myPort;
                pingActive();
            }
            timer++;
        }else{
            if(timer!=0){
                console.log("Disconnected from network");
                timer = 0;
            }
        }
    },1000);
}

export function pingActive(){
    var options = {
        host: centralNodeUrl,
        port: centralNodePort,
        path: '/pingActive',
        method: 'POST',
        headers: { "newNodeUrl": myNodeUrlOffline},
      };
      http.request(options, function (res) {
        res.setEncoding('utf8');
        if(res.statusCode == 200) {
            res.setEncoding('utf8');
        }else{
            res.setEncoding('utf8');
            console.log("Not Connected");
            registeredNetwork = [myNodeUrlOffline];
            connected=false;
        }
    }).end();
}

myNode.get('/updateBlockchain', function (req, res) {
    var options = {
        host: centralNodeUrl,
        port: centralNodePort,
        path: '/blockchain',
        method: 'GET'
      };
      http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            if (res.statusCode == 200) {
                res.setEncoding('utf8');
                theBlockchain = JSON.parse(chunk);
            }
        });
    }).end();
    res.send(theBlockchain);
});
function connectedCheck(){
    if(registeredNetwork.indexOf(centralNodeUrl+":"+centralNodePort)==-1){
        connected=false;
    }else{
        connected=true;
    }
}

myNode.get('/validatorNetwork',function (req, res) {
    var message = {
        message : "",
        network : registeredNetwork,
    }
    if(message.network.indexOf(centralNodeUrl+":"+centralNodePort)==-1){
        message.message = "Disconnected from validator network"
    }else{
        message.message = "Connected from validator network"
    }
    res.send(message);
});

myNode.post("/register-node",function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlrPresent = registeredNetwork.indexOf(newNodeUrl) == -1;
    const notCurrentNode = myNodeUrlOffline !== newNodeUrl;
    if(nodeNotAlrPresent&&notCurrentNode){
        registeredNetwork.push(newNodeUrl);
    }
    return res.json({note : "New Node Registered successfully"});
});
myNode.post("/register-node-bulk",function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = registeredNetwork.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = myNodeUrlOffline !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) {
           registeredNetwork.push(networkNodeUrl);
        }
    });
    return res.json({ note: 'Bulk registration successful.' });
});

myNode.post("/newFormPendingTransaction", function (req, res){
    var transaction = req.body.transaction;
    theMempool.transactionCache.push(transaction);
    res.send("Transaction added to Mempool");
});

myNode.get('/mempool', function (req, res) {
    res.send(theMempool);
});

export async function joinValidator(){
    var options = {
        host: centralNodeUrl,
        port: centralNodePort,
        path: '/register-and-broadcast-node',
        method: 'POST',
        headers: { "newNodeUrl": myNodeUrlOffline},
      };
    http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            if (res.statusCode == 200) {
                console.log("Joined Validator Network");
                connected=true;
                pingActive();
            }
        });
    }).end();
    var options = {
        host: centralNodeUrl,
        port: centralNodePort,
        path: '/blockchain',
        method: 'GET'
      };
    http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            if (res.statusCode == 200) {
                res.setEncoding('utf8');
                theBlockchain = JSON.parse(chunk);
            }
        });
    }).end();
    var options = {
        host: centralNodeUrl,
        port: centralNodePort,
        path: '/mempool',
        method: 'GET'
      };
    http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            if (res.statusCode == 200) {
                res.setEncoding('utf8');
                theMempool = JSON.parse(chunk);
            }
        });
    }).end();
}


export function checkMempool(){
    var timer = 0;
    var session = false;
    setInterval(async ()=>{
        if(theMempool.transactionCache.length!=0||theMempool.verifiedTransactions.length!=0){
            if(timer==0&!session){
                timer = 60*3;
                session = true;
                console.log("Staking and Validation Started");
            }
        }
        if(session){
            if(timer>0){
                timer--;
            }else{
                session=false;
                console.log("Staking and Validation Ended");

            }
        }
    },1000);
}
myNode.get('/blockchain', function (req, res) {
    res.send(theBlockchain);
});



