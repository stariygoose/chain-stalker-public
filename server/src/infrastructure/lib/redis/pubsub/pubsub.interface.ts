export interface IPubSub {
  publish(channel: string, payload: any): Promise<void>;
}
