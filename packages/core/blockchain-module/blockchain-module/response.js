import crypto from "crypto"

export class Response{
    constructor(formId,answers,responseID,publicKey,privateKey){
        this.formId = formId
        this.answers = answers;
        this.responsePublicKey = publicKey;
        this.responseID = responseID;
        var responseData = this.formId+JSON.stringify(this.answers)+this.responsePublicKey+this.responseID;
        const sign = crypto.createSign('SHA256');
        sign.write(responseData);
        sign.end();
        const signature = sign.sign(privateKey,'hex');
        this.signature = signature;
    }
}
export class Answer{
    constructor(questionID,input){
        this.questionID = questionID;
        this.input = input;
    }
}