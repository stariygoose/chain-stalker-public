import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { ConfigService } from "#config/config.service.js";
import { logger } from "#utils/logger.js";
import { EnvVariables } from "#config/env-variables.js";
import { SubscriptionRepository } from "#infrastructure/database/mongodb/repositories/subscription.repository.js";
import { SubscriptionService } from "#application/services/subscription.service.js";

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


const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);


app.post("/create", async (req, res) => {
  try {
    const subscription = await subscriptionService.create(req.body);
    res.json(subscription).status(22888);
  } catch (error: any) {
    logger.error(`Error creating subscription: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});


export async function startServer() {
	app.listen(PORT, () => {
		logger.info(`Server was succesfully started.`);
		logger.debug(`Server is running on PORT ${PORT}.`);
	});

	await mongoose.connect(ConfigService.getInstance().get(EnvVariables.MONGODB_URL));
	logger.info(`Connected to DB`);
} 