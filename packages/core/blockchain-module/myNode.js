import {Block} from "./block.js";
import express from "express";
import axios from 'axios';
import Redis from "redis";
import { Blockchain } from "./blockchain.js";
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';
import * as http from 'http'; //ES 6
const myNode = express();
myNode.use(express.json());
myNode.use(express.urlencoded({extended:false}));


var centralNodeUrl = "localhost";
var centralNodePort = 8000;
var theBlockchain = new Blockchain();
var theMempool;
var myPort = 9000;
var myNodeUrl = await publicIpv4()+":"+myPort;
var myNodeUrlOffline = "localhost:"+myPort;

var connected = false;

var registeredNetwork = [myNodeUrlOffline];

function runLivePing(){
    pingActive();
    console.log("Current IP : "+myNodeUrlOffline);
    setInterval(async ()=>{
        myNodeUrl = await publicIpv4()+":"+myPort;
        if(connected){
            pingActive();
        }
        
    },1000*60);
}

function pingActive(){
    console.log("Pinging");
    var options = {
        host: centralNodeUrl,
        port: centralNodePort,
        path: '/pingActive',
        method: 'GET',
        headers: { "newNodeUrl": myNodeUrlOffline},
      };
      http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            if(res.statusCode == 200) {
                res.setEncoding('utf8');
                console.log("Pinged Active");
            }
            if(res.statusCode == 404){
                res.setEncoding('utf8');
                console.log("Disconnected");
                registeredNetwork = [myNodeUrlOffline];
                connected=false;
            }
        });
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
myNode.get('/validatorNetwork',function (req, res) {
    var message = {
        message : "",
        network : registeredNetwork,
    }
    if(message.network.indexOf(centralNodeUrl+":"+centralNodePort)==-1){
        message.message = "Disconnected from validator network"
    }else{
        message.message = "Connected from validator network"
        connected=true;
    }
    res.send(message);
});
myNode.get('/joinValidatorNetwork',function (req, res) {
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
                pingActive();
            }
        });
    }).end();
    res.send("Connected To Validator Network");
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

myNode.get('/blockchain', function (req, res) {
    res.send(theBlockchain);
});
myNode.listen(myPort,()=>{
    console.log(`Running on port `+myPort);
});
runLivePing();