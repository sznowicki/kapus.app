import crypto from 'crypto';
import words from './diceware/words.js';

export const gerRandomNumber  = (max) => {
	return crypto.randomInt(max);
};

export const getRandomWord = () => {
	// Get random item from array
	const seed = gerRandomNumber(words.length - 1);

	return words[seed];
};

export const getPassword = () => {
	const words = [
		getRandomWord(),
		getRandomWord(),
		getRandomWord(),
	];

	return words.join('-');
};
