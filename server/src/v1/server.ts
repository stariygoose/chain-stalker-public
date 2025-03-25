import dotenv from "dotenv";
dotenv.config();

import { startServer } from "#representation/app.js";

await startServer();