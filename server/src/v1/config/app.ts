import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { ConfigService } from "./config.service.js";
import { logger } from "../utils/logger.js";
import { EnvVariables } from "./env-variables.js";

const app = express();

const config = ConfigService.getInstance();
const DOMAIN_URL = config.get(EnvVariables.DOMAIN_URL);
const PORT = config.get(EnvVariables.SERVER_PORT);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: `https://${DOMAIN_URL}`,
  credentials: true,
}));

export function startServer() {
	app.listen(PORT, () => {
		logger.info(`Server is running on PORT ${PORT}`);
	})	
} 