import {readFileSync} from 'fs';
import {resolve} from 'path';
import {renderHtml} from '../../lib/ssr-render.js';
import { emitPageView } from '../../lib/plausible.js';
import {SessionRoom} from '../../lib/SessionRoom.js';


const indexTemplate = readFileSync(resolve(import.meta.dirname, './index.template.html'), 'utf-8');

export const indexController = async (req, res) => {
	const stats = SessionRoom.getStats();
	emitPageView(req, 'index');

	const html = await renderHtml(indexTemplate, {
		stats,
	});

	res.send(html);
};
