import {gerRandomNumber, getPassword} from './diceware.js';
import { UserError } from './Errors.js';

const roomsStorage = new Map();

export const MAX_ROOMS = 1000;
// 10 minutes
export const TIME_TO_LIVE = 10 * 60 * 1000;

export class SessionRoom {
	static getAvailableRoomId() {
		do {
			const roomId = gerRandomNumber(MAX_ROOMS);
			if (roomsStorage.has(roomId)) {
				continue;
			}
			return roomId;
		} while (true);
	}

	constructor() {
		this.roomId = this.constructor.getAvailableRoomId();
		this.password = getPassword();
		this.content = '';
		this.modified = new Date();
	}

	setContent(newContent) {
		this.content = newContent;
		this.modified = new Date();
	}

	toJson() {
		return {
			roomId: this.roomId,
			password: this.password,
			content: this.content,
			modified: this.modified.toISOString(),
		};
	}

	static createRoom() {
		const size = roomsStorage.size;
		if (size >= MAX_ROOMS) {
			throw new UserError('TOO_MANY_ROOMS_SORRY');
		}

		const room = new SessionRoom();
		roomsStorage.set(room.roomId, room);

		return roomsStorage.get(room.roomId);
	}

	static hasRoom(roomId)  {
		return roomsStorage.has(roomId);
	}

	static getRoom(roomId, password) {
		const room = roomsStorage.get(roomId);

		if (!room) {
			throw new UserError('ROOM_NOT_FOUND');
		}

		if (room.password !== password) {
			throw new UserError('WRONG_PASSWORD');
		}

		return room;
	}

	static destroyRoom(roomId, password) {
		const room = this.getRoom(roomId, password);
		if (!room) {
			throw new UserError('WRONG_PASSWORD');
		}

		roomsStorage.delete(roomId);

		return true;
	}

	static  flushOld()  {
		for (const [roomId, room] of roomsStorage.entries()) {
			if (Date.now() - room.modified.getTime() > TIME_TO_LIVE) {
				roomsStorage.delete(roomId);
			}
		}
	}

	static getStats() {
		return roomsStorage.size;
	}
}
