import crypto from "crypto"


export class Block{
    constructor(index,transactions=[],previousHash=""){
        this.index = index;
        this.timestamp = "Pending";
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        var blockData = this.previousHash+this.timestamp+JSON.stringify(this.transactions)+this.index;
        const hash = crypto.createHash("sha256").update(blockData).digest("base64");
        return hash.toString();
    }
    setTimeStamp(){
        this.timestamp = Date.now().toString();
    }
    
}