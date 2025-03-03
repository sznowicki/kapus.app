import {
	encrypt,
	decrypt,
	ENCRYPTED_FLAG,
} from './crypto.js';

export class KapusEncryption extends HTMLElement {
	connectedCallback() {
		this.passkeyInput = this.querySelector('#input-encryption');
		this.contentTextArea = this.querySelector('#input-content');
		this.cryptoResultTextArea = this.querySelector('#input-crypto');
		const form = this.querySelector('#form-main');
		const passKeyFromLocal = localStorage.getItem('passkey');

		if (passKeyFromLocal) {
			this.passkeyInput.value = passKeyFromLocal;
		}

		this.decrypt();

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			if (!this.passkeyInput.value) {
				alert('Please pick a passkey');
				return false;
			}
			this.encrypt();
			this.contentTextArea.disabled = true;
			this.cryptoResultTextArea.name = 'content';
			this.cryptoResultTextArea.disabled = false;
			setTimeout(() => {
				form.submit();
			}, 1000);
		});

		this.passkeyInput.addEventListener('input', () => {
			localStorage.setItem('passkey', this.passkeyInput.value);
			if (this.contentTextArea.value.startsWith(ENCRYPTED_FLAG)) {
				this.decrypt();
			}
		});
	}

	getPassAndContent() {
		const passkey = this.passkeyInput.value;
		const content = this.contentTextArea.value;

		return { passkey, content };
	}

	encrypt() {
		const { passkey, content } = this.getPassAndContent();
		const encrypted = encrypt(passkey, content);
		this.cryptoResultTextArea.value = encrypted;
	}

	decrypt() {
		const { passkey, content } = this.getPassAndContent();
		if (!content) {
			return;
		}
		const decrypted = decrypt(passkey, content);
		this.cryptoResultTextArea.value = decrypted;
	}
};

window.customElements.define('kapus-encryption', KapusEncryption);
