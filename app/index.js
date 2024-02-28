import express from 'express';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { withAsyncErrorHandler } from "./lib/withAsyncErrorHandler.js";
import {indexController} from "./controllers/index/index.controller.js";

const main = async () => {
    const app = express();
		app.use(cookieParser());
		app.use('/static', express.static('public'));
		app.use('/', bodyParser.urlencoded());
    app.use('/', withAsyncErrorHandler(indexController));

    app.listen(3000, () => {
			console.log('server running');
		});
}
main();
