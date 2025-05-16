import { Subscription } from "#lib/api/response.js";
import { Context, Scenes } from "telegraf";


export interface Jwt {
	refreshToken?: string;
	accessToken?: string;
}

export interface MySession<T extends Scenes.WizardSessionData = Scenes.WizardSessionData> extends Scenes.WizardSession<T> {
	jwt: Jwt;
	subsIdsHashTable: Record<string, string>;
	targetToEdit?: Subscription
}

export interface MyContext<T extends Scenes.WizardSessionData = Scenes.WizardSessionData> extends Context {
	session: MySession<T>;
	scene: Scenes.SceneContextScene<MyContext<T>, T>;
	wizard: Scenes.WizardContextWizard<MyContext<T>> & { state: T };
}