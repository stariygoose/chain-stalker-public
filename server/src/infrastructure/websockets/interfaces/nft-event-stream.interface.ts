
export interface INftEventStream {
	setSlug(slug: string): void;
	addUser(userId: number): void;
	removeUser(userId: number): void;
	disconnect(): void;
}