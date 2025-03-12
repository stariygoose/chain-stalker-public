import mongoose, { Schema } from "mongoose";
const NftCollectionSchema = new Schema({
    address: { type: String, required: true, unique: true, index: true },
    chain: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    floorPrice: { type: Number },
    symbol: { type: String },
}, { timestamps: true });
const NftCollection = mongoose.model("NftCollection", NftCollectionSchema);
export { NftCollection };
