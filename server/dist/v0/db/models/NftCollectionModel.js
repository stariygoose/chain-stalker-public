import mongoose from "mongoose";
const nftSchema = new mongoose.Schema({
    address: { type: String, require: true },
    chain: { type: String, require: true },
    collection: { type: String, require: true, unique: true, index: true },
    name: { type: String, require: true },
    floorPrice: { type: Number },
    floorPriceSymbol: { type: String },
}, { timestamps: true });
const NftCollection = mongoose.model("NftCollection", nftSchema);
export { NftCollection };
