import Mustache from 'mustache';
import { readFileSync } from "fs";
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const beforeTemplate = readFileSync(resolve(import.meta.dirname, './partials/before.html'), 'utf-8');
const afterTemplate = readFileSync(resolve(import.meta.dirname, './partials/after.html'), 'utf-8');

// Random short hash via crypto
const hash = randomBytes(6).toString('hex');

export const renderHtml = async (template, incomingData) => {
	const data = {
		hash,
		...incomingData,
	}

	const before = Mustache.render(beforeTemplate, data);
	const after = Mustache.render(afterTemplate, data);

	const html = Mustache.render(template, {
		...data,
		before,
		after,
	});

	return html;
};
