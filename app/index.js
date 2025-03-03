import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { withAsyncErrorHandler } from './lib/withAsyncErrorHandler.js';
import {indexController} from './controllers/index/index.controller.js';
import {
	getRoomController,
	postNewRoomController,
	postRoomController
} from './controllers/room/room.controllers.js';
import {SessionRoom} from "./lib/SessionRoom.js";

const env = {
	PLAUSIBLE_REPORTED_DOMAIN: process.env.PLAUSIBLE_REPORTED_DOMAIN,
	KAPUS_BASE_URL: process.env?.KAPUS_BASE_URL ??  'https://kapus.app',
};

const main = async () => {
	const app = express();
	app.set('base_url', env.KAPUS_BASE_URL);

	app.use((req, res, next) => {
		req.env = env;
		next();
	});

	app.use(cookieParser());
	app.use('/static', express.static('public'));
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());

	app.get('/', withAsyncErrorHandler(indexController));

	app.get('/room/:id', withAsyncErrorHandler(getRoomController));
	app.post('/room', withAsyncErrorHandler(postNewRoomController));
	app.post('/room/:id', withAsyncErrorHandler(postRoomController));

	setInterval(() => {
		console.log('flushing old rooms');
		SessionRoom.flushOld();
	}, 10000);

	app.listen(3000, () => {
		console.log('server running');
	});
};
main();
