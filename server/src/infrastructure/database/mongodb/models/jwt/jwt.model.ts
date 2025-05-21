import mongoose from "mongoose"


const JwtSchema = new mongoose.Schema(
	{
		userId: { type: Number, required: true, ref: 'Users' },
		refreshToken: { type: String, required: true }
	}
);

export const JwtModel = mongoose.model('JwtTokens', JwtSchema);