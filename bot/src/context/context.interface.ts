import { Context } from "telegraf";

export interface IStore {
	refreshToken?: string;
	accessToken?: string;
}

export interface IContext extends Context {
	session: IStore;
}