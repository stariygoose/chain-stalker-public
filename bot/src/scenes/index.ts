import { Scenes } from "telegraf";

import { MyContext } from "#context/context.interface.js";
import { createTokenScene } from "#scenes/scenes/create-token/create-token.scene.js";
import { createCollectionScene } from "#scenes/scenes/create-collection/create-collection.scene.js";


export const createSceneStage = (): Scenes.Stage<MyContext> => {
	const stage = new Scenes.Stage<MyContext>([
		createTokenScene as unknown as Scenes.WizardScene<MyContext<Scenes.WizardSessionData>>,
		createCollectionScene as unknown as Scenes.WizardScene<MyContext<Scenes.WizardSessionData>>
	]);

	return stage;
}