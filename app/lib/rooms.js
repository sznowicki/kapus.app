import { UserError } from "./Errors.js";

const roomsStorage = new Map();


export const createRoom = (roomId, password) => {
	if (roomsStorage.has(roomId)) {
		// This should never happen.
		throw new Error('INTERNAL_ERROR_ROOM_BUSY');
	}

	roomsStorage.set(roomId, {
		roomId,
		password,
		content: '',
	});

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

