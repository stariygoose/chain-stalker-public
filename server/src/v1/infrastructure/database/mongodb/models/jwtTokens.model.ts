import mongoose, { Schema } from "mongoose";

const jwtTokenSchema = new Schema({
	userId: { type: Number, required: true, ref: 'User' },
	refreshToken: { type: String, required: true }
});

export const JwtTokenModel = mongoose.model('JwtToken', jwtTokenSchema);