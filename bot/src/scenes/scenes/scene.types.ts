export const SceneTitle = {
	CREATE_TOKEN: 'create-token-scene',
	CREATE_COLLECTION: 'create-collection-scene',
	CHANGE_STRATEGY: 'change-strategy-subscription-scene',
} as const;
export type SceneKey = typeof SceneTitle[keyof typeof SceneTitle]; 