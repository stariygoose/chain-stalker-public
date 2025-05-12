import { Composer, Scenes } from "telegraf";

import { MyContext } from "#context/context.interface.js";
import { SceneKey } from "#scenes/scenes/scene.types.js";
import { Container } from "inversify";


type ActionHandler<T extends Scenes.WizardSessionData> = {
	callbackData: string;
	handler: (ctx: MyContext<T>) => Promise<unknown>;
}

export class SceneBuilder<T extends Scenes.WizardSessionData> {
	private _steps: Composer<MyContext<T>>[] = [];
	private _actions: ActionHandler<T>[] = [];

	constructor (
		public readonly name: SceneKey
	) {}

	public step(
		_stepName: string,
		handler: Composer<MyContext<T>> | ((ctx: MyContext<T>) => Promise<unknown>)
	): this {
		const composer = 
			handler instanceof Composer
				? handler
				: new Composer<MyContext<T>>().use(handler);

		this._steps.push(composer);
		return this;
	}

	public action(
		callbackData: string,
		handler: (ctx: MyContext<T>) => Promise<unknown>
	): this {
		this._actions.push({ callbackData, handler });

		return this;
	}

	public build(): Scenes.WizardScene<MyContext<T>> {
		const scene = new Scenes.WizardScene<MyContext<T>>(this.name, ...this._steps);

		for (const action of this._actions) {
			const { callbackData, handler } = action;
			scene.action(callbackData, handler);
		}

		return scene;
	}

	public static create<T extends Scenes.WizardSessionData>(name: SceneKey) {
		return new SceneBuilder<T>(name);
	}
}