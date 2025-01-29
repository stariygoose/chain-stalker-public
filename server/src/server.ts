import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import { initStalkRouter } from "./routes/StalkRouter.js";
import { subsRouter } from './routes/SubsRouter.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';
import { OpenSea } from './services/marketplaces/OpenSea.js';
import { BinanceWebsocketManager } from './services/marketplaces/binance/BinanceWebsocketManager.js';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/AuthRouter.js';

const app: Express = express();

const PORT = process.env.SERVER_PORT ?? 1488;
const MONGO_URL = process.env.MONGODB_URL ?? "";


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://${DOMAIN_URL}',
  credentials: true,
}));

export async function startServer() {
	try {
		mongoose.connect(MONGO_URL)
			.then(() => console.log(`[INFO]: Successfully connected to the database.`))
			.catch((error: Error) => {
				console.error(`[CRITICAL ERROR]: Error while connecting to the database.`, {
					error: error.message,
					mongoUrl: process.env.MONGODB_URL
				});
				process.exit(1);
			});

		const WebsocketManager = new BinanceWebsocketManager();
		const os = new OpenSea();

		const stalkRouter = initStalkRouter(os, WebsocketManager);
		app.use("/api/v1", stalkRouter);
		app.use("/api/v1/subscriptions", subsRouter);
		app.use("/api/v1/auth", authRouter);
		
		app.use(errorMiddleware);

		OpenSea.initStalksAfterReboot(os)
			.then(() => console.log("[INFO]: OpenSea service was successfully set up."))
			.catch((error: Error) => {
				console.error(`[CRITICAL ERROR]: Can't connect to the OpenSea Stream API: ${error.message}`);
			});
		WebsocketManager.initWebsocketsAfterReboot()
			.then(() => console.log("[INFO]: Binance WebSocket Manager was successfully set up."))
			.catch((error: Error) => {
				console.error(`[CRITICAL ERROR]: Can't initialize Binance WebSocket Manager: ${error.message}`);
			});
	} catch (error: any) {
		console.error(`[ERROR]: Unexpected error while starting the server: ${error.message}`);
		process.exit(1);
	}

	app.listen(PORT, () => {
		console.log(`[INFO]: Server is running on port ${PORT}`);
	});
}

startServer();
