import { EventStream } from "#infrastructure/websockets/interfaces/event-stream.js";

export interface INftEventStream extends EventStream {
	disconnect(): void;
	stalk(userId: number, slug: string): void;
}