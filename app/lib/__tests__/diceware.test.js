import { describe, it } from 'node:test';
import assert from 'node:assert';

import { getRandomWord } from '../diceware.js';
import words from '../diceware/words.js';

describe('diceware', () => {
	describe('getRandomWord', () => {
		it('should give random word', () => {
			const word = getRandomWord();
			const secondWord = getRandomWord();
			assert(word !== secondWord);
			assert(words.includes(word));
			assert(words.includes(secondWord));
		});
	});
});
