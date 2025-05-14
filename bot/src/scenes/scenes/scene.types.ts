export const SceneTitle = {
	CREATE_TOKEN: 'create-token-scene',
	CREATE_COLLECTION: 'create-collection-scene',
	EDIT_SUBSCRIPTION: 'edit-subscription-scene',
} as const;
export type SceneKey = typeof SceneTitle[keyof typeof SceneTitle]; 