import express from 'express';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { withAsyncErrorHandler } from "./lib/withAsyncErrorHandler.js";
import {indexController} from "./controllers/index/index.controller.js";
import {flushOld} from "./lib/rooms.js";

const main = async () => {
    const app = express();
		app.use(cookieParser());
		app.use('/static', express.static('public'));
		app.use('/', bodyParser.urlencoded());
    app.use('/', withAsyncErrorHandler(indexController));

		setInterval(() => {
			console.log('flushing old rooms');
			flushOld();
		}, 10000);
    app.listen(3000, () => {
			console.log('server running');
		});
}
main();
