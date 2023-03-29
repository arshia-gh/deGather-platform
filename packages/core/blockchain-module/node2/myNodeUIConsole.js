
import promptSync from 'prompt-sync';
import {joinValidator} from "./myNode.js"
const prompt = promptSync();


var input = "";
while(input.toString()!="quit"){
    input = prompt("DeGather > ");
    if(input=="join"){
       joinValidator();
       continue;
    }
}
