import Mustache from 'mustache';
import { readFileSync } from "fs";
import { resolve } from 'path';

const beforeTemplate = readFileSync(resolve(import.meta.dirname, './partials/before.html'), 'utf-8');
const afterTemplate = readFileSync(resolve(import.meta.dirname, './partials/after.html'), 'utf-8');

export const renderHtml = async (template, data) => {
	const before = Mustache.render(beforeTemplate, data);
	const after = Mustache.render(afterTemplate, data);

	const html = Mustache.render(template, {
		...data,
		before,
		after,
	});

	return html;
};
