import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
	{
		userId: { type: Number, required: true, unique: true }
	},
	{ timestamps: true }
);

export const UserModel = mongoose.model('Users', userSchema);