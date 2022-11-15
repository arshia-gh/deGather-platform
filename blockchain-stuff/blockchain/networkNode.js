import {deGatherBlockchain, Block} from "./Block.js";
import { deGatherMempool, Mempool } from "./Mempool.js";
import { privateKey,publicKey } from "./rsaGenerator.js";
import express from "express"
import axios from 'axios';
import Redis from "redis";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const port = process.argv[2];

const client= Redis.createClient();

function parseKey(base64Key){
    return Buffer.from(base64Key, "base64").toString("ascii");
}
app.get("/forms",function(req,res){
    let formList = [];
    deGatherBlockchain.chain.forEach(block=>{
        if(block.index>0){
            block.transactions.forEach(transaction=>{
                formList.push(transaction);
            });
        }
    });
    if(formList.length==0){
        return res.json({
            note : "Blockchain Empty",
        });
    }else{
        return res.json({
            note : "All Form Retrieved",
            formList : formList
        });
    }
});
app.post("/forms",function(req,res){
    const bodyParam = req.body;
    let formCreated = deGatherBlockchain.pendingBlock.createNewForm(
        bodyParam.authorID,parseKey(bodyParam.publicKey),bodyParam.fee,bodyParam.totalRewards,
        bodyParam.participantsCountTarget,bodyParam.onceOnly,parseKey(bodyParam.privateKey));
    return res.json({
        note : "Form Created!",
        form : formCreated
    });
});
app.get("/:authorID/forms",function(req,res){
    let authorID = req.params.authorID;
    let authorForms = deGatherBlockchain.findFormByAuthorID(authorID);
    if(authorForms.length==0){
        return res.json({
            note : "No form founded by this author"
        });
    }else{
        return res.json({
            note : "Forms Founded",
            form : authorForms
        });
    }
});
app.get("/forms/:formID",function(req,res){
    let formID = req.params.formID;
    let theForm = deGatherBlockchain.findFormByID(formID);
    if(theForm==null){
        return res.json({
            note : "Form not founded"
        });
    }else{
        return res.json({
            note : "Form founded",
            form : theForm
        });
    }
});

app.get('/blockchain', function (req, res) {
    res.send(deGatherBlockchain);
  });
  /*
app.get('/mempool', function (req, res) {
    res.send(deGatherMempool);
  });
app.post("/createSurvey", function (req, res){
    const request = deGatherBlockchain.pendingBlock.createNewSurvey(parseKey(req.body.publicKey),
        req.body.fee,req.body.totalRewards,req.body.targetParticipant,req.body.onceOnly,parseKey(req.body.privateKey));
    res.send("Transaction added to Mempool");
});
app.post("/createAndBroadcastSurvey",function(req,res){
    const request = deGatherBlockchain.pendingBlock.createNewSurvey(parseKey(req.body.publicKey),
        req.body.fee,req.body.totalRewards,req.body.targetParticipant,req.body.onceOnly,parseKey(req.body.privateKey));
    const requestPromises = [];
    deGatherMempool.networkNodes.forEach(newNodeUrl=>{
        const requestOptions ={
            url: newNodeUrl + "/createSurvey",
            method:"POST",
            data : {
                publicKey : req.body.publicKey,
                fee : request.fee,
                totalRewards : request.totalRewards,
                targetParticipant : request.targetParticipant,
                onceOnly : request.onceOnly,
                privateKey : req.body.privateKey
            }
        };
        requestPromises.push(axios(requestOptions));
    });
    Promise.all(requestPromises).then(data=>{
        return res.json({note : "Survey created and broadcasted successfully"});
    });
});



app.post("/createResponse",function(req,res){
    const request = deGatherBlockchain.pendingBlock.createResponse(req.body.surveyID,req.body.answers,parseKey(req.body.publicKey),parseKey(req.body.privateKey));
    res.send("Response request being send...");
});
app.post("/createAndBroadcastResponse",function(req,res){
    const request = deGatherBlockchain.pendingBlock.createResponse(req.body.surveyID,req.body.answers,parseKey(req.body.publicKey),parseKey(req.body.privateKey));
    const requestPromises = [];
    
    deGatherMempool.networkNodes.forEach(newNodeUrl=>{
        const requestOptions ={
            url: newNodeUrl + "/createResponse",
            method:"POST",
            data : {
                surveyID : req.body.surveyID,
                answers : request.answers,
                responseID : request.responseID,
                responseUserID : request.responseUserID,
                responseSignature : request.responseSignature,
                publicKey : req.body.publicKey,
                privateKey : req.body.privateKey
            }
        };
        requestPromises.push(axios(requestOptions));
    });
    Promise.all(requestPromises).then(data=>{
        return res.json({note : "Response created and broadcasted successfully"});
    });
})
app.get("/verifyPendingMempoolTransaction",function(req,res){
    const request = deGatherMempool.verifyAllPendingTransactions();
    res.send("All transaction verified");
});

app.post("/postVerifiedMempool",function(req,res){
    const request = deGatherBlockchain.consensusMempool.push(req.body);
    res.send("Verified Transactions into Consensus Mempool");
});
app.get("/consensusTransaction",function(req,res){
    deGatherBlockchain.consensusTransaction();
    res.send("Added To Pending Block");
})
app.get("/verifySendAndBroadcastVerifiedMempool",function(req,res){
    deGatherMempool.verifyAllPendingTransactions();
    const request = deGatherMempool.fillPendingBlock();
    const requestPromises = [];
    
    deGatherMempool.networkNodes.forEach(newNodeUrl=>{
        const requestOptions ={
            url: newNodeUrl + "/postVerifiedMempool",
            method:"POST",
            data : request
        };
        requestPromises.push(axios(requestOptions));
    });
    Promise.all(requestPromises).then(data=>{
        if(deGatherBlockchain.consensusMempool.length>=(deGatherMempool.networkNodes.length+1)*80/100){
            deGatherBlockchain.consensusTransaction();
            const pendingBlockPromises = [];
            deGatherMempool.networkNodes.forEach(newNodeUrl=>{
                const pendingBlockRequest ={
                    url: newNodeUrl + "/consensusTransaction",
                    method:"GET",
                };
                requestPromises.push(axios(pendingBlockRequest));
            });
            Promise.all(pendingBlockPromises).then(data=>{
                deGatherBlockchain.mintBlock();
                const pendingMintPromises = [];
                deGatherMempool.networkNodes.forEach(newNodeUrl=>{
                    const pendingMintRequest ={
                        url: newNodeUrl + "/mintBlock",
                        method:"GET",
                    };
                    requestPromises.push(axios(pendingMintRequest));
                });
                Promise.all(pendingMintPromises).then(data=>{
                    return res.json({note : "Block Minted"});
                });
            });
        }else{
            return res.json({note : "Verified Mempool added to consensus"});
        }
        
    });
    
})
app.get("/mintBlock",function(req,res){
    const request = deGatherBlockchain.mintBlock();
    res.send("Block Minted");
});
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (deGatherMempool.networkNodes.indexOf(newNodeUrl) == -1&&newNodeUrl!=deGatherMempool.currentNodeUrl) { // -1 Means the item is not available inside the array
        deGatherMempool.networkNodes.push(newNodeUrl);
    }
    const regNodesPromiess = [];
    deGatherMempool.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: networkNodeUrl + '/register-node',
            method: "POST",
            data: { newNodeUrl: newNodeUrl }
        };
        regNodesPromiess.push(axios(requestOptions));
    });
    Promise.all(regNodesPromiess).then(data => {
        const bulkRegisterOptions = {
            url: newNodeUrl + "/register-node-bulk",
            method: "POST",
            data: {
                allNetworkNodes: [...deGatherMempool.networkNodes, deGatherMempool.currentNodeUrl]
            }
        };
        return axios(bulkRegisterOptions);
    }).then(data => {
        return res.json({ note: 'New node registered with the network successfully' });
    });
});
app.post("/register-node",function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlrPresent = deGatherMempool.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = deGatherMempool.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlrPresent&&notCurrentNode){
        deGatherMempool.networkNodes.push(newNodeUrl);
    }
    return res.json({note : "New Node Registered successfully"});
});
app.post("/register-node-bulk",function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = deGatherMempool.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = deGatherMempool.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) {
            deGatherMempool.networkNodes.push(networkNodeUrl);
        }
    });
    return res.json({ note: 'Bulk registration successful.' });
});*/
app.listen(port,function(){
    console.log(`Listening on port ${port}...`);
});
