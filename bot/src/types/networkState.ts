export const NetworkState = {
	ETHEREUM: "ethereum",
	ARBITRUM: "arbitrum",
	SOLANA: "solana"
} as const

export type NetworkStateKeys = typeof NetworkState[keyof typeof NetworkState];