export const SceneTitle = {
	CREATE_TOKEN: 'create-token-scene',
	CREATE_NFT: 'create-nft-scene',
	MY_STLKS: 'my-stalks-scene'
} as const;
export type SceneKey = typeof SceneTitle[keyof typeof SceneTitle]; 