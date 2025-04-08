
export interface INftEventStream {
	disconnect(): void;
	stalk(userId: number, slug: string): void;
}