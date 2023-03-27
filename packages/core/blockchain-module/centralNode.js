import {Block} from "./block.js";
import express from "express";
import axios from 'axios';
import Redis from "redis";
import { Blockchain } from "./blockchain.js";
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';

const myNode = express();
myNode.use(express.json());
myNode.use(express.urlencoded({extended:false}));

var deGatherBlockchain = new Blockchain();
// var deGatherMempool = new Mempool();
var centralNodeUrlOffline = "localhost:8000";
var centralNodeUrl = await publicIpv4()+":8000";

var registeredNetwork = [centralNodeUrlOffline];
var activeNetwork = [];
var inactiveNetwork = [];

function putInactive(){
    inactiveNetwork.forEach(inactiveNode => {
        var index = registeredNetwork.indexOf(inactiveNode);
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
    console.log("Check active...");
}

function IPUpdate(){
    console.log("Current IP : "+centralNodeUrlOffline);
    setInterval(async ()=>{
        centralNodeUrl = await publicIpv4()+":8000";
        putInactive();
    },1000*60);
}
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
myNode.get("/pingActive",function(req,res){
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
    console.log(req.headers.newnodeurl);
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

deGatherBlockchain.pendingBlock.transactions.push("lol");

myNode.listen(8000,()=>{
    console.log(`Running on port 8000`);
});
IPUpdate();
