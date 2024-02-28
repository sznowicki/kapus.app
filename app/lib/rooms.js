import { UserError } from "./Errors.js";

const roomsStorage = new Map();

class Room {
	constructor(roomId, password) {
		this.roomId = roomId;
		this.password = password;
		this.content = '';
		this.modified = new Date();
	}

	setContent(newContent) {
		this.content = newContent;
		this.modified = new Date();
	}
}
export const createRoom = (roomId, password) => {
	const size = roomsStorage.size;
	if (size > 1000) {
		throw new UserError('TOO_MANY_ROOMS_SORRY');
	}

	if (roomsStorage.has(roomId)) {
		// This should never happen.
		throw new Error('INTERNAL_ERROR_ROOM_BUSY');
	}

	roomsStorage.set(roomId, new Room(roomId, password));

	return roomsStorage.get(roomId);
}

export const getRoom = (roomId, secret) => {
	const room = roomsStorage.has(roomId) ? roomsStorage.get(roomId) : createRoom(roomId, secret);

	if (room && room.password === secret) {
		return room;
	}
	throw new UserError('WRONG_PASSWORD');
}

export const destroyRoom = (roomId, password) => {
	const room = getRoom(roomId, password);
	roomsStorage.delete(roomId);

	return true;
}

// 1 minute
const TIME_TO_LIVE = 60 * 1000;

export const flushOld = () => {
	for (const [roomId, room] of roomsStorage.entries()) {
		if (Date.now() - room.modified.getTime() > TIME_TO_LIVE) {
			roomsStorage.delete(roomId);
		}
	}
}

export const getStats = () => {
	const size = roomsStorage.size;

	return size;
}

