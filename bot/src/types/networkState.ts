export const NetworkState = {
	ETHEREUM: "ethereum"
} as const

export type NetworkStateKeys = typeof NetworkState[keyof typeof NetworkState];