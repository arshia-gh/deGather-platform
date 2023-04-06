import crypto from "crypto"
import {Block} from "./block.js";

export class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.pendingBlock = this.createPendingBlock();
    }
    createGenesisBlock(){
        return new Block(0,"Genesis","Initial");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    getBlockchainLength(){
        return deGatherBlockchain.chain.length;
    }
    createPendingBlock(){
        var newBlock = new Block(this.getLatestBlock().index+1,[],this.getLatestBlock().hash);
        return newBlock;
    }
    mintBlock(){
        this.pendingBlock.setTimeStamp();
        this.pendingBlock.hash = this.pendingBlock.calculateHash();
        this.chain.push(this.pendingBlock);
        this.pendingBlock= this.createPendingBlock();
    }
    fillPendingBlock(transactions){
        this.pendingBlock.transactions = transactions;
    }
}