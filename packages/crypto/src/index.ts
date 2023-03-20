import crypto from 'node:crypto';
import base58 from 'bs58';
import { promisify } from 'node:util';

/**
 * KEY_TYPE is used to determine the type of key pair to generate.
 */
export const KEY_TYPE = 'ec' as const;

/**
 * HASH_TYPE is used to determine the type of hash algorithm to use.
 */
export const HASH_TYPE = 'sha256' as const;

export const CIPHER_TYPE = 'aes-256-cbc' as const;

const generateKeyPair = promisify(crypto.generateKeyPair);

export const generateKeyPairAsync = async () => {
	return generateKeyPair(KEY_TYPE, {
		namedCurve: 'secp256k1',
	}).then(keyPair => {
		return {
			publicKey: keyPair.publicKey,
			privateKey: keyPair.privateKey,
		};
	});
};

export const hash = (data: crypto.BinaryLike) => {
	return crypto.createHash(HASH_TYPE).update(data).digest();
};

export const sign = (data: crypto.BinaryLike, privateKey: crypto.KeyObject) => {
	const signer = crypto.createSign(HASH_TYPE);
	signer.update(data);
	return signer.sign(privateKey);
};

export const verify = (
	data: crypto.BinaryLike,
	signature: Buffer,
	publicKey: crypto.KeyObject,
) => {
	return crypto
		.createVerify(HASH_TYPE)
		.update(data)
		.verify(publicKey, signature);
};

export const encode = (buffer: Buffer) => {
	return base58.encode(buffer);
};

export const decode = (base58String: string) => {
	return base58.decode(base58String);
};

export const exportPublicKey = (publicKey: crypto.KeyObject) => {
	return publicKey.export({
		type: 'spki',
		format: 'pem',
	});
};

export const importPublicKey = (publicKey: string) => {
	return crypto.createPublicKey({
		key: publicKey,
		format: 'pem',
		type: 'spki',
	});
};

export const exportPrivateKey = (
	privateKey: crypto.KeyObject,
	passphrase: string,
) => {
	return privateKey.export({
		type: 'pkcs8',
		format: 'pem',
		cipher: CIPHER_TYPE,
		passphrase,
	});
};

export const importPrivateKey = (privateKey: string, passphrase: string) => {
	return crypto.createPrivateKey({
		key: privateKey,
		format: 'pem',
		type: 'pkcs8',
		passphrase,
	});
};

export const generateWalletAddress = (publicKey: crypto.KeyObject) => {
	const publicKeyHash = hash(publicKey.export());
	const walletAddress = encode(publicKeyHash);
	return walletAddress;
};
