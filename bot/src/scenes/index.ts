import { Scenes } from "telegraf";

import { MyContext } from "#context/context.interface.js";
import { createTokenScene } from "#scenes/scenes/create-token/create-token.scene.js";


export const createSceneStage = (): Scenes.Stage<MyContext> => {
	const stage = new Scenes.Stage<MyContext>([
		createTokenScene as unknown as Scenes.WizardScene<MyContext<Scenes.WizardSessionData>>,
	]);

	return stage;
}