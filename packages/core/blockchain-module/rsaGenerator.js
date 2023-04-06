import crypto from "crypto"
export const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    }
  });
  export const privateKeyBase64 = Buffer.from(privateKey).toString('base64');
  export const publicKeyBase64 = Buffer.from(publicKey).toString('base64');

  console.log(privateKeyBase64+"\n\n");
  console.log(publicKeyBase64);