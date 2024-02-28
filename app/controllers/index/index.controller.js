import {readFileSync} from 'fs';
import {resolve} from 'path';
import {renderHtml} from "../../lib/ssr-render.js";
import {destroyRoom, getRoom} from '../../lib/rooms.js';
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
			res.cookie.delete('roomId');
			res.cookie.delete('secret');
		}

		const room = roomId ? getRoom(roomId, secret) : null;

		if (room) {
			res.cookie('roomId', roomId, cookieOpts);
			res.cookie('secret', secret, cookieOpts);

			if (content) {
				room.content = content;
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
		hasRoom: !!room,
		noRoom: !room,
		hasError: !!error,
	};

	console.log(data);

	const html = await renderHtml(indexTemplate, data);

	res.send(html);
}
