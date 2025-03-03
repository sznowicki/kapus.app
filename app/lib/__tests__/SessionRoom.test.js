import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
	SessionRoom,
	MAX_ROOMS,
	TIME_TO_LIVE,
} from '../SessionRoom.js';

describe('SessionRoom', () => {
	it('should create easy to remember room password ', () => {
		const room = SessionRoom.createRoom();
		assert(room.roomId <= MAX_ROOMS);
		assert(room.roomId > -1);

		assert(room.password.split('-').length === 3);
		room.password.split('-').forEach((word) => {
			assert(word.length > 2);
		});
	});

	it('should get room', () => {
		const room = SessionRoom.createRoom();
		const received = SessionRoom.getRoom(room.roomId, room.password);

		assert(room === received);
	});
});
