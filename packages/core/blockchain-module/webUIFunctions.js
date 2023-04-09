import crypto from "crypto"


function parseKey(base64Key){
    return Buffer.from(base64Key, "base64").toString("ascii");
}
function getAddress(publicKey){
    var addressRaw = crypto.createHash("sha256").update(parseKey(publicKey)).digest("base64");
    var address = addressRaw.toString().slice(0, 40);
    return address;
}
function generateSignature(authorPrivateKey){
    var theTransaction =  {
        "senderAddress" : "0zUeHqPrvHt+3eiGbHv4wokeUj7ARk3W1nbRdSx/",
        "receiverAddress" : "0x01",
        "creditAmount" : 2000,
        "timestamp" : "05/04/2023",
        "data" : {
            "authorID" : "LMP2PFJf2jRjKcHgCHiq6D2CeL43",
            "publicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF2VFh4azEyY3ZTUHovZGNCaTRLNwpPc3FDMmtNOXg1WkJXbXhWT0RsNGR2a3RLaWRsVllwcHdEMEJkeWNtdy9nSHFqdTIzZHI0bTN5NnNVMVhmVU12CkZ3ZFZzcDc1Zm1zY0ZwWGlYS25tenllUWxESDMyamdtQ0FWVUFXRExtSEVMRHpZVkpwRS9ob0NwUXdYTElMV1kKZURhb1B6ZUYyZUFuOUMxS0ZtQncybCsrRHI0VXU0VFBHR3MyaTNGWVpSd0Fia3pxZGROOGFNUytzeHZpelRFSAorNWpmeXhxbzl1TWx3UExzVmF4Z2pTMlhVTXZTaVp2WUQzaTFONWdnY3dqZGJKRnYrL2kzWHdoc3dNMFVDT2VaCnBiTDNuK2c3WWN4TUJGNkVuamViTW5JTDlmK2srQk0vYVhwWXVXUmxBWExLVDBadk9xdjlYZitocktuNERjRUUKVFFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
            "fee": 700,
            "totalRewards": 20000,
            "participantsCountTarget" : 10000,
            "onceOnly": true,
            "privateKey": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRQzlOZkdUWFp5OUkvUDkKMXdHTGdyczZ5b0xhUXozSGxrRmFiRlU0T1hoMitTMHFKMlZWaW1uQVBRRjNKeWJEK0FlcU83YmQydmliZkxxeApUVmQ5UXk4WEIxV3ludmwrYXh3V2xlSmNxZWJQSjVDVU1mZmFPQ1lJQlZRQllNdVljUXNQTmhVbWtUK0dnS2xECkJjc2d0Wmg0TnFnL040WFo0Q2YwTFVvV1lIRGFYNzRPdmhTN2hNOFlhemFMY1ZobEhBQnVUT3AxMDN4b3hMNnoKRytMTk1RZjdtTi9MR3FqMjR5WEE4dXhWckdDTkxaZFF5OUtKbTlnUGVMVTNtQ0J6Q04xc2tXLzcrTGRmQ0d6QQp6UlFJNTVtbHN2ZWY2RHRoekV3RVhvU2VONXN5Y2d2MS82VDRFejlwZWxpNVpHVUJjc3BQUm04NnEvMWQvNkdzCnFmZ053UVJOQWdNQkFBRUNnZ0VBRFBnQmt1UTd0Z3NjMGkxR2dkVjRGOU9Cbkl3M1U5TE1yL0gwOVdHYkRDeVEKRisrVFZvV2lNZmI4ZnJwRVFmSmlOQnpicitFdVlSbnZnZStYSzVMTFMzekpOdkVHa00rdW9TMnMwa1VpK05meApaUGIzMGhFL0toV1RhSFRGLzdEZjNTOEx6QlR3a2J1SDNud3JMQmJHV0pjR2VTN0pFZUgzV3hrdmx0RU5heW8rCm9sNUtGbXBRcnRoRVVCTlVJMkZJdlNGZXlYbkNWWmMwdU9lTTJTeHpzbCtDY3V4UnBCa05DVUE3YWVndlRIOWMKMWprdVpic28ya3RFQ1F4NkFNU2ZFN2NpYXVDeWJHV2lEKzZmR3pIRmNJekRQUEJxRGtKdTh4UTRxTkQrc3pzbwoyYjgvT1JSbjM5Ukx2TFM2Rys3T0ZYbUsxRUp6Z29JWit6ak5CTFptMFFLQmdRRGg3a3p2RWNHZS8vQ09YNmpsCk4vV2FDSGxPU0RnUFpoVS9CRFVUZW45V2RUL2ExOHBhMWNFYlJiaVdFeDczTnFvTVpFQTVOZUtLT0h0d2lXbTkKejZrbWZJeHg0OE9HWGtyVS9ITU5FUExyUmYvQmt0empZTGlMaHJXYjVlQThMdkV3dWRybUhHS2xGN3k3R1NGawpUMkVSZ3RKRXpNRlA0UWtsdDVEaGpUV1RKd0tCZ1FEV1pJeTBVNUgvN2dZM2lmT0Z0dnc0Y0tZRnlpOWlHdjFVClhVYXVkSllQZ3ZrNm5FMkptbnVRbm4xUnpvc1FLcGY3ckpuczBwdjZVc1BxMkkxL3Z3a1pLMlFvbThxbzJSSjcKYVNEZEpmUXdhRHl2QUV4ZXNNNmNZd2tmbVhqb3NHdHNaUEZtS2F4eDlQTndic1NOVDA5aVlyT0ZndER1WnZ5YwpldnI3dnBWRmF3S0JnUUNodWhUR1daNlJNOEsrRjhudDgwWFRNbGVyYXRUK2FPT3lqVTkxRnc0S0ZMcFY3SHlFCjAxaDlMa1o0MzAwZVI3b29UcWNPalAwU1ZtWStZNDhXK1l5cTZTTWI3NStxRXR0Y1pTM3lYM3lVWURJNUhla1MKdHN6RHkvVTZtSzRRUnNZT1RDeGU1bGpTdHhBNW1qNmw4SkNhbVZ2dE5lajNSaTVuR21VU29DT0dwd0tCZ1FDegpvTjk3SHlJT3F1R3VtdmpjcWVvOVo3VFMyUXBHU3BMQ29yeGI0dmJ2M0M3eGVwQkVvSml6SFBlbkdVVE9zTUZTCmJ0VXc1VzBtbVQzcGdMTmR1elBtVU1MRWUzT2JjUFRaVGNYcFJLbUovV3dLdkZkQVp5ZFZSRzBhZXI0aFI5OVoKbkdIZDFVRFU0Z1V0eU1FS0hNOUlnYVlrVU95NU1yU29ieW5tejFIR0xRS0JnSEZXTy83bWN4ZHZ1VDYyd0IxSQpaR3NSSGx1UE1uZWRvOUlLbHBVQlc0VTZ4Yy9MVUpIWkdsYVJ0U09QMEN2REJFTTF5RUtoWjM5MXBkS25wc2dzClhiYXZENmVzTTdrVzhxa0tyWWRycVY5OERkcU1RSlZya3NMblo5V3VDcHJla2VXYUhPZkk1UGRsM0tnaTQwTWMKS1kwMFZKZmx6SlZoNDEvNlZHS0JtQkt0Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K",
            "formQuestions" : [
                {
                    "sectionID":0,
                    "sectionName" : "Introduction Section",
                    "questions":[
                        {
                            "questionNum":1,
                            "question": "Do you have a pet?",
                            "type": "RADIO",
                            "answers":["Yes","NO"]
                        },
                        {
                            "questionNum":2,
                            "question": "Do you see pet as your friend?",
                            "type": "RADIO",
                            "answers":["Yes","NO"]
                        },
                        {
                            "questionNum":3,
                            "question": "What pet would you like to have?",
                            "type": "TEXT"
                        }
                    ],
                    "navigateTo": 1
                },
                {
                    "sectionID":1,
                    "sectionName" : "Pet Owner Section",
                    "questions":[
                        {
                            "questionNum":4,
                            "question": "Do you have a pet?",
                            "type": "RADIO",
                            "answers":["Yes","NO"]
                        }
                    ],
                    "navigateTo": null
                }
            ],
            "closeOnTarget" : true
        },
        "txID":"test",
        "senderPublicKey":"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFwRHMvNlhLZmhvNGczbU9uZkV0SwpJNFlLWXgraUQweEV3WURGdkVMOU1NQ0psZE5HZVN3TUxsM0hnTzRxYkZQd3Q2Q1c0Vk1iU0xmR05FckdWakZnCkc3c2tWRXd6NHdtWDlkZGU5QmphcDJKMWZ3bHRRNXlSVFh2SW5vdUt5d2QvS2w5REp0dWtHVWp1Nlc2aDhsNksKaXQzaU9wRzN6RHd6UWRJa2dxamJ4N0U2ZW16QnBnMDM4K0Y3YnE5blFITjlmK29ER2h6dzgvWlZnQ1Z0U2dXRwpmWHFmOXNNVHA0Q044VWszSGlPUTlXRHhNUEVzQnhRdkl5dmRVUE1EVThEckcreW5rM3RPMmV6clJnaGJzOWxqCjJmQ2lqeDJGK0lOU1dUcDQrdGRiVjIrbHc3aEdCVWpsRFQxV0d5azNJbmdQempYM3FxMDdTNW1VQXpnZHpHZSsKbXdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
    };
    const sign = crypto.createSign('SHA256');
    var transactionData = theTransaction.senderAddress+theTransaction.receiverAddress+theTransaction.creditAmount+theTransaction.timestamp+JSON.stringify(theTransaction.data)+theTransaction.txID+theTransaction.senderPublicKey;
    sign.write(transactionData);
    sign.end();
    const signature = sign.sign(parseKey(authorPrivateKey), 'hex');
    return signature;
}
var signature = generateSignature("LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2d0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktrd2dnU2xBZ0VBQW9JQkFRQ2tPei9wY3ArR2ppRGUKWTZkOFMwb2poZ3BqSDZJUFRFVEJnTVc4UXYwd3dJbVYwMFo1TEF3dVhjZUE3aXBzVS9DM29KYmhVeHRJdDhZMApTc1pXTVdBYnV5UlVURFBqQ1pmMTExNzBHTnFuWW5WL0NXMURuSkZOZThpZWk0ckxCMzhxWDBNbTI2UVpTTzdwCmJxSHlYb3FLM2VJNmtiZk1QRE5CMGlTQ3FOdkhzVHA2Yk1HbURUZno0WHR1cjJkQWMzMS82Z01hSFBEejlsV0EKSlcxS0JZWjllcC8yd3hPbmdJM3hTVGNlSTVEMVlQRXc4U3dIRkM4aks5MVE4d05Ud09zYjdLZVRlMDdaN090RwpDRnV6MldQWjhLS1BIWVg0ZzFKWk9uajYxMXRYYjZYRHVFWUZTT1VOUFZZYktUY2llQS9PTmZlcXJUdExtWlFECk9CM01aNzZiQWdNQkFBRUNnZ0VCQUtKLzliYzVzVnJrR3VXeFdUR0ZGYkNjbW42RitFYUd3cWxzanpxK1ZlUDkKUHFXK3pVWnNMUWxieFdGdlJ3NjA1OFBwNUNERHFJV0ZRVnJRZWZzakUrT2Nnay9lcnFDQkI1azdKenNEdEtaVwpwOGV4UGluZUsyK3RnVTVPNkdBSDVPMjZJS204UGx5K2E1Y1IzckFBbDdqYjMxTHdpQnBQbnJBTURCQTBvSEt1Cjlmei81dFR3NmRpQURubGdTQWxuRGI5cEpVMGVqWEZxTWk5ZDZqdjBFWFByeTh1UXRRRHpJMW9tVjd1ZUV3RGgKcHZWMzU5YUZiQkJmZjFSbmhUTUpsOHFRWDdvR1pZVEY4cmhkWFdwSXhRL3llU2NaUS9uY2RidHBuMmxGemt6dgo2NnlXRkZqbU1hOURJbTVnWmRmdE1Gd3R5VEJvZTJLempZZHF4YnpRUjlFQ2dZRUExYnFHRGdFUmlNZVBIWm9uCnlTNnhTeUNBSFM1MG5VVlYyRG42RHBkRWRJZk1ydlQ3dDJIUENKb09keTg1d1VDNkNaM0YrNE9EU09YazdSYUQKS3dKcWRyK1IxV3RmUEFTTlBXZ0VuTXdmdmVhOU96WTJEK3pKYVROaldBTXR6dG9Hd3dVcG90MHJhc3d5d3l3QgpYa1NOTHI0SDhCSVMxSU96K2JXZnUzS0RaTFVDZ1lFQXhMYVh1UEJwUGF6L1NPekFKUVBMZURjeW5EQ3FlT2I2CnZPd29xYzFRV3IvaHNNVkh5K0Raa3Y2K2oxSHMzMVhTcDZmRDFxVHBoSUlReUkrZWxyUHRaRnNQS2ZKVkFMdHEKUHRwOEphVDlsN3dyaXcrWGNVdk1Lc0xRMzBlNEhDbnBuUmhTMVFlUE1DZmQ1dFhJb2dPLzBMUzVZZE9ieEt2RwozejV4UGJHQWVBOENnWUVBcytna2U1bE9wekpFT0FqUlFMbjdKMkFlTjNJcFcxRkg1NUUxK2g0KzAxQ1ViUmx1CjRYaUZpNW9TWHlUem1zYmZVc1RxS01NVk9jRzZxQS94TGIwRTNSeDRwNHVRU0xjVUpRSndENFNMbTVDazdUaSsKM1R6V2RhVjZGRlhvczF3M29PV3huSlJMdmNSUlhwU21PakcrSGdCOE1nc2txcHFLWHNJUnlQbWx2SmtDZ1lBUApvUTVHOUZyNE9vR0I4c1dGYTFyRUwyYUhBRnJiQmtjUHNaZTlmZ0dQWkVWelBRbHFTbkFlL0x4NU9LSWdVSHBQCk5jWWFqTG04L0hTRzZ0cEgwUDNnaGxlYkZwVG9YUHVoQ016cVZNU05STGNVOG1VdTdEM0plL2NLZG5GTFU0MHIKSFI2ZnJGMFZEMlhUREZOSGhCSythMDE3VjB1K0FZUG9ndGFPZDBia3d3S0JnUUNXMnZGYzErOGlFK3Q1MUlLWAovcm5QZXNYd0xtYlI4TXFnWU90aGxIWFNNb21qbnJKNWYvZmJRRFFySEhUWDQ1UVJQaFdUYzBsVTdxQ2hxeXhnCjVLTnNmR0cxb08wYUF3YjR4NmZVS2tPLzllS0ExcXkyRWlXQ1ZaOTVZenRURVZUMS94cnN0WlNJOCtleUtHSGQKT1d2cDVmOFZQREpyWVF0UFJSYzc1NFlCdEE9PQotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==");
console.log(signature)
