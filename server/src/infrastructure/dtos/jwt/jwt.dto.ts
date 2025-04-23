import { ObjectId } from "mongoose";

export class JwtDbRecord {
	constructor (
		public readonly _id: ObjectId | null,
		public readonly userId: number,
		public readonly refreshToken: string
	) {}
}