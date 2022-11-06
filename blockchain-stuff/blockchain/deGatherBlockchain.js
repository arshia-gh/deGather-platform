import crypto from "crypto"
import {Block} from "./Block.js";

export class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.pendingBlock = null;
    }
    createGenesisBlock(){
        return new Block(0,"Genesis Block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    createPendingBlock(){
        var newBlock = new Block(this.getLatestBlock().index+1,[],this.getLatestBlock().hash);
        this.pendingBlock = newBlock;
    }
    addBlock(){
        this.pendingBlock.hash = this.pendingBlock.calculateHash();
        this.pendingBlock.setTimeStamp();
        this.chain.push(this.pendingBlock);
        this.pendingBlock = null;
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== prevBlock.hash ){
                return false;
            }
        }
        return true;
    }
    
}
