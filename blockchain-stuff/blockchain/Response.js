import crypto from "crypto"

export class Response{
    constructor(answers,responseID,responseUserID,privateKey){
        this.answers = answers;
        this.responseID = responseID;
        this.responseUserID = responseUserID;
        const sign = crypto.createSign('SHA256');
        var responseData = this.answers+this.responseID+this.responseUserID;
        sign.write(responseData);
        sign.end();
        const signature = sign.sign(privateKey,'hex');
        this.responseSignature = signature;
    }
}