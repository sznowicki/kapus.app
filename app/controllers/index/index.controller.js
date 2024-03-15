import {readFileSync} from 'fs';
import {resolve} from 'path';
import {renderHtml} from "../../lib/ssr-render.js";
import {destroyRoom, getRoom, getStats} from '../../lib/rooms.js';
import {UserError} from "../../lib/Errors.js";

const cookieOpts = {
	maxAge: 1000 * 60 * 60 * 24 * 365,
	httpOnly: true,
}

const indexTemplate = readFileSync(resolve(import.meta.dirname, './index.template.html'), 'utf-8');

const roomGetter = (req, res) => {
	try {
		let { roomId, secret, content, clear } = req.body ?? {};

		if (!roomId) {
			roomId = req.cookies.roomId;
			secret = req.cookies.secret;
		}

		if (clear) {
			destroyRoom(roomId, secret);
			roomId = null;
			secret = null;
			// Delete cookies
			res.clearCookie('roomId');
			res.clearCookie('secret');
		}

		const room = roomId ? getRoom(roomId, secret) : null;

		if (room) {
			res.cookie('roomId', roomId, cookieOpts);
			res.cookie('secret', secret, cookieOpts);

			if (content) {
				room.setContent(content);
			}
		}

		return room;

	} catch (error) {
		throw error;
	}
}
export const indexController = async (req, res) => {
	let error = null;
	let room = null;
	const stats = getStats();

	try {
		room = roomGetter(req, res);
	} catch (incomingError) {
		console.log(incomingError);
		if (incomingError instanceof UserError) {
			error = incomingError.message;
		} else {
			error = 'Internal error.'
		}
	}

	const data = {
		room,
		error,
		stats,
		hasRoom: !!room,
		noRoom: !room,
		hasError: !!error,
	};


	const html = await renderHtml(indexTemplate, data);

	res.send(html);
}
