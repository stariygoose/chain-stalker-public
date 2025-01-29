import mongoose from "mongoose"

const basedSubscriptionSchema = new mongoose.Schema(
	{
		userId: { type: Number, require: true, index: true, ref: 'User' },
		percentage: { type: Number, require: true, default: 5 },
		isStalked: { type: Boolean, require: true, default: true },
	},
	{ timestamps: true, discriminatorKey: "type" }
)

const nftSubscriptionSchema = new mongoose.Schema({
	target: {
		address: { type: String, require: true },
		chain : { type: String, require: true },
		collection: { type: String, require: true, index: true },
		name: { type: String, require: true },
		floorPrice: { type: Number, require: true },
		floorPriceSymbol: { type: String, require: true }
	}	
})

const coinSubscriptionSchema = new mongoose.Schema({
	target: {
		symbol: { type: String, require: true, index: true },
		price: { type: Number, require: true }
	}
})

basedSubscriptionSchema.index({ userId: 1 });
coinSubscriptionSchema.index({ "target.symbol": 1, userId: 1 });
nftSubscriptionSchema.index({ "target.collection": 1, userId: 1 });

const Subscription = mongoose.model("Subscription", basedSubscriptionSchema);

const NftSubscription = Subscription.discriminator("NftSubscription", nftSubscriptionSchema);
const CoinSubscription = Subscription.discriminator("CoinSubscription", coinSubscriptionSchema);

export { NftSubscription, CoinSubscription };