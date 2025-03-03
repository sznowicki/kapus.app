import {SessionRoom} from '../../lib/SessionRoom.js';
import {renderExpiredHtml, renderRoomHtml} from './renderRoom.js';
import {emitPageView} from '../../lib/plausible.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const postNewRoomController = async (req, res) => {
	emitPageView(req, 'newRoom');
	const room = SessionRoom.createRoom();

	res.redirect(
		302,
		`/room/${room.roomId}?password=${encodeURIComponent(room.password)}`
	);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const postRoomController = async (req, res) => {
	const roomId = parseInt(req.params.id, 10);
	const password = req.query.password;
	let room;
	let error;
	try {
		room = SessionRoom.getRoom(roomId, password);
		if (req.body.clear) {
			SessionRoom.destroyRoom(roomId, password);

			emitPageView(req, 'roomClear');

			res.redirect(
				302,
				'/',
			);
		} else {
			if (req.body.content) {
				room.content = req.body.content;
			}
		}
	} catch (e) {
		error = e;
	}

	if (req.get('Accept') === 'application/json') {
		if (error) {
			res.status(400).send({ error: error.message });
			return;
		}
		res.send(room.toJson());
		return;
	}

	if (error?.message === 'ROOM_NOT_FOUND') {
		emitPageView(req, 'roomNotFound');
		return renderExpiredHtml(res, room, error);
	}

	emitPageView(req, 'roomUpdate');

	await renderRoomHtml(res, room, error);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getRoomController = async(req, res) => {
	const roomId = parseInt(req.params.id, 10);
	const { password} = req.query;
	const expired = !SessionRoom.hasRoom(roomId);
	let room;
	let error = expired ? 'ROOM_NOT_FOUND' : null;

	try {
		room = !error && SessionRoom.getRoom(roomId, password);
	} catch (e) {
		error = e;
	}

	if (req.get('Accept') === 'application/json') {
		if (error) {
			res.status(400).send({ error: error.message });
			return;
		}
		res.send(room.toJson());
		return;
	}

	if (expired) {
		emitPageView(req, 'roomExpired');
		return renderExpiredHtml(res, room, error);
	}

	emitPageView(req, 'roomView');
	await renderRoomHtml(res, room, error);
};
