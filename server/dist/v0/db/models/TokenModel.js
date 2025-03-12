import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
    userId: { type: Number, required: true, ref: 'User' },
    refreshToken: { type: String, required: true }
});
export const TokenModel = mongoose.model('JwtToken', tokenSchema);
