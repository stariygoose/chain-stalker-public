import { model } from "mongoose";
import { TargetSchema } from "#infrastructure/database/mongodb/models/subscription/targets/targets.schemas.js";

export const TargetModel = model("Target", TargetSchema);
