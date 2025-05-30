import {SessionRoom} from '../../lib/SessionRoom.js';
import {renderHtml} from '../../lib/ssr-render.js';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import qrcode from 'qrcode';

const roomTemplate = readFileSync(resolve(import.meta.dirname, './room.template.html'), 'utf-8');
const expiredRoomTemplate = readFileSync(resolve(import.meta.dirname, './expired-room.template.html'), 'utf-8');


export const renderRoomHtml = async (res, room, error) => {
	let qrCode = null;
	if (room?.roomId) {
		const url = new URL(res.app.get('base_url'));
		url.pathname = `/room/${room.roomId}`;
		url.searchParams.append('password', room.password);
		qrCode = await qrcode.toDataURL(url.toString());
	}

	const data = {
		room,
		error: error?.message,
		stats: SessionRoom.getStats(),
		hasRoom: !!room,
		hasError: !!error,
		qrCode
	};

	const html = await renderHtml(roomTemplate, data);
	res.send(html);
};

export const renderExpiredHtml = async (res, room, error) => {
	const data = {
		room,
		error: error.message,
		stats: SessionRoom.getStats(),
		hasRoom: !!room,
		hasError: !!error,
	};

	const html = await renderHtml(expiredRoomTemplate, data);
	res.send(html);
};
