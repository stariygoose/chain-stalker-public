import mongoose, { Schema } from "mongoose";

const basedSubscriptionSchema = new Schema(
	{
		userId: { type: Number, required: true, index: true, ref: 'User' },
		percentage: { type: Number, required: true, default: 5 },
		isActive: { type: Boolean, required: true, default: true }
	},
	{ timestamps: true, discriminatorKey: "type" }
)

const nftSubscriptionSchema = new Schema({
	target: {
		address: { type: String, required: true },
		chain: { type: String, required: true },
		slug: { type: String, required: true, index: true, ref: 'NftCollection' },
		name: { type: String, required: true },
		floorPrice: { type: Number },
		symbol: {type: String, required: true} 
	}
});

const tokenSubscriptionSchema = new Schema({
	target: {
		symbol: { type: String, required: true, index: true },
		address: { type: String },
		price: { type: Number, required: true }
	}
})

basedSubscriptionSchema.index({ userId: 1 });
tokenSubscriptionSchema.index({ "target.symbol": 1, userId: 1 });
nftSubscriptionSchema.index({ "target.slug": 1, userId: 1 });

const Subscription = mongoose.model("Subscription", basedSubscriptionSchema);

const NftSubscription = Subscription.discriminator("NftSubscription", nftSubscriptionSchema);
const TokenSubscription = Subscription.discriminator("TokenSubscription", tokenSubscriptionSchema);

export { NftSubscription, TokenSubscription };