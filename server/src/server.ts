import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from "express";
import mongoose from "mongoose";

import { initStalkRouter } from "./routes/StalkRouter.js";
import { subsRouter } from './routes/SubsRouter.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';
import { OpenSea } from './services/marketplaces/OpenSea.js';
import { BinanceWebsocketManager } from './services/marketplaces/binance/BinanceWebsocketManager.js';

const app: Express = express();
const port = process.env.SERVER_PORT ?? 1488;


app.use(express.json());

export async function startServer() {
	try {
		mongoose.connect(process.env.MONGODB_URL ?? "")
			.then(() => console.log(`[INFO]: Successfully connected to the database.`))
			.catch((error: Error) => {
				console.error(`[CRITICAL ERROR]: Error while connecting to the database: ${error.message}`);
				console.log(`[ADVICE]: Try deleting the ./data folder (where the database and cache are stored) and restarting.`);
			});

		const WebsocketManager = new BinanceWebsocketManager();
		const os = new OpenSea();

		const stalkRouter = initStalkRouter(os, WebsocketManager);
		app.use("/api/v1", stalkRouter);
		app.use("/api/v1", subsRouter);
		app.use(errorMiddleware);

		OpenSea.initStalksAfterReboot(os)
			.then(() => console.log("[INFO]: OpenSea service was successfully set up."))
			.catch((error: Error) => {
				console.error(`[CRITICAL ERROR]: Can't connect to the OpenSea Stream API: ${error.message}`);
				process.exit(1);
			});
		WebsocketManager.initWebsocketsAfterReboot()
			.then(() => console.log("[INFO]: Binance WebSocket Manager was successfully set up."))
			.catch((error: Error) => {
				console.error(`[CRITICAL ERROR]: Can't initialize Binance WebSocket Manager: ${error.message}`);
				process.exit(1);
			});
	} catch (error: any) {
		console.error(`[ERROR]: Unexpected error while starting the server: ${error.message}`);
		process.exit(1);
	}

	app.listen(port, () => {
		console.log(`[INFO]: Server is running on port ${port}`);
	});
}

startServer();
