import crypto from "crypto"
export class Form{
    constructor(id,authorPublicKey,title,subtitle,publishDate,endDate,derivedFrom,
        description,totalRewards,participantsCountTarget,onceOnly,questionList,closeOnTarget){
        this.id = id;
        this.authorPublicKey = authorPublicKey;
        this.title = title;
        this.subtitle = subtitle;
        this.publishDate = publishDate;
        this.endDate = endDate;
        this.derivedFrom = derivedFrom;
        this.description = description;
        this.totalRewards = totalRewards;
        this.participantsCountTarget = participantsCountTarget;
        this.onceOnly=onceOnly;//boolean same user multiple response on survey
        this.questionList = questionList;
        this.closeOnTarget = closeOnTarget;
        const sign = crypto.createSign('SHA256');
        var formData = this.id+this.authorPublicKey+this.title+this.subtitle+this.publishDate.toDateString()+
        this.endDate.toDateString()+this.derivedFrom+this.description+this.totalRewards+this.participantsCountTarget+this.onceOnly
        +this.closeOnTarget+JSON.stringify(questionList);
        sign.write(formData);
        sign.end();
        const signature = sign.sign(authorPrivateKey, 'hex');
        this.authorSignature = signature;
    }
}

export class Question{
    constructor(id,label,hint,description,optional){
        this.id = id;
        this.label = label;
        this.hint = hint;
        this.description = description;
        this.optional = optional;
    }
}
export class TextQuestion extends Question{
    constructor(minLength,maxLength,format,inputType){
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.format = format;
        this.inputType = inputType;
    }
}
export class ScaleQuestion extends Question{
    constructor(minValue,maxValue,step,minLabel,maxLabel){
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        this.minLabel = minLabel;
        this.maxLabel = maxLabel;
    }
}
export class ChoiceQuestion extends Question{
    constructor(minSelection,maxSelection){
        this.options = [];
        this.minSelection = minSelection;
        this.maxSelection = maxSelection;
    }
    createOption(label,value,group){
        var newOption = new Option(label,value,group);
        this.options.push(newOption);
    }
}
export class Option{
    constructor(label,value,group){
        this.label = label;
        this.value = value;
        this.group = group
    }
}