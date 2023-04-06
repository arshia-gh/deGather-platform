
import promptSync from 'prompt-sync';
import {joinValidator,stakePOS} from "./myNode.js"
const prompt = promptSync();

var input = "";
while(input.toString()!="quit"){
    input = prompt("DeGather > ");
    if(input=="join"){
       joinValidator();
       continue;
    }else if(input.split(" ")[0]=="stake"){
        if(!isNaN(input.split(" ")[1])){
            var staked = (Number)(input.split(" ")[1])
            stakePOS(staked);
            console.log("Staked Amount set : "+staked);
        }else{
            console.log("Staked Amount not Valid!");
        }
    }
}
