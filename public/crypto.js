export const ENCRYPTED_FLAG = 'KAPUSENCODED:';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const encode  = (text) => {
	const normalizedText = text.normalize('NFC'); // Normalize to NFC
	const ui8 = encoder.encode(normalizedText);
	return ENCRYPTED_FLAG + ui8.toString();
};

export const decode = (text) => {
	const ui8asText = text.slice(ENCRYPTED_FLAG.length);
	const ui8 = Uint8Array.from(ui8asText.split(','));
	return decoder.decode(ui8);
};

export const xor = (key, text) => {
	if (!key) {
		return text;
	}

	let output = '';
	for (let i = 0; i < text.length; i++) {
		output += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
	}

	return output;
};

export const encrypt = (key, text) => {
	const xored = xor(key, text);
	return encode(xored);
};

export const decrypt = (key, text) => {
	const decoded = decode(text);
	return xor(key, decoded);
}
