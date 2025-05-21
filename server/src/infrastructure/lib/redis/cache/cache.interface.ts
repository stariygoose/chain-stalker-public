export interface ICache {
	get<T = string>(key: string): Promise<T | null>;
  set<T = string>(key: string, value: T, ttlInSeconds?: number): Promise<void>;
}