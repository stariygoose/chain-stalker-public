import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true }
});
export const UserModel = mongoose.model('User', userSchema);
