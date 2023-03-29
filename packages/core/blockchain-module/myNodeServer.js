import {myNode,runLivePing,checkMempool,changePort} from "./mynode.js"
import promptSync from 'prompt-sync';
const prompt = promptSync();

var portInput = prompt("Input the port > ");

var thePort = changePort(portInput);

myNode.listen(thePort,()=>{
    console.log(`Running on port `+thePort);
});
runLivePing();
checkMempool();

