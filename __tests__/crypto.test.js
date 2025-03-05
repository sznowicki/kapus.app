import { describe, it} from 'node:test';
import assert from 'node:assert';
import {
	decode, decrypt,
	encode, encrypt,
	ENCRYPTED_FLAG,
} from '../public/crypto.js';

describe('crypto', () => {
	describe('encode/decode', () => {
		it('should code, encode', () => {
			const text = 'text🦄';
			const encoded = encode(text);
			assert(encoded === 'KAPUSENCODED:116,101,120,116,240,159,166,132');
			const decoded = decode(encoded);
			assert.strictEqual(decoded, text);
		});

		it('should encrypt/decrypt', () => {
			const text = 'TEST💜';
			const key = 'sample-simple-key';
			const encrypted = encrypt(key, text);
			assert(encrypted === 'KAPUSENCODED:39,36,62,36,240,164,147,185');
			const decrypted = decrypt(key, encrypted);
			assert.strictEqual(decrypted, text);
		});
	});
});
