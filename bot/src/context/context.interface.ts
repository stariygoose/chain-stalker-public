import { Context, Scenes } from "telegraf";


interface Jwt {
	refreshToken?: string;
	accessToken?: string;
}

interface TokenRequest {
	symbol?: string;
	strategy?: 'percentage' | 'absolute';
	threshold?: number;
}

export interface MySession<T extends Scenes.WizardSessionData = Scenes.WizardSessionData> extends Scenes.WizardSession<T> {
	jwt: Jwt;
	tokenRequest: TokenRequest;
}

export interface MyContext<T extends Scenes.WizardSessionData = Scenes.WizardSessionData> extends Context {
	session: MySession<T>;
	scene: Scenes.SceneContextScene<MyContext<T>, T>;
	wizard: Scenes.WizardContextWizard<MyContext<T>> & { state: T };
}