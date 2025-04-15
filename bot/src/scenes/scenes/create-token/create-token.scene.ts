import { Scenes, Markup, Composer } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons } from '#ui/index.js';
import { MyContext } from "#context/context.interface.js";
import { menuOption } from "#ui/menu/menu.js";
import { checkStrategy } from "#lib/helpers/helpers.js";


interface ICreateTokenSceneWizard extends Scenes.WizardSessionData { 
	symbol: string;
	strategy: 'percentage' | 'absolute';
	threshold: number;
}

export const createTokenScene = SceneBuilder
	.create<ICreateTokenSceneWizard>(SceneTitle.CREATE_TOKEN)
	.step(`Get Token Symbol`, async (ctx) => {
		const message = [
			`What's the token symbol?`,
			`Currently, i work only with Binance.`
		];

		await ctx.reply(message.join("\n"), {
			...Markup.inlineKeyboard([
				[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
			])
		});

		return ctx.wizard.next();
	})
	.step(`Get Strategy`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {
		ctx.wizard.state.symbol = ctx.message.text;

		const message = [
			`Which strategy to notify would you like to use?`
		];

		await ctx.reply(message.join("\n"), {
			...Markup.keyboard([
				[
					Markup.button.text(Buttons.percentageStrategy.text),
					Markup.button.text(Buttons.absoluteStrategy.text)
				]
			]).oneTime().resize()
		})

		return ctx.wizard.next();
	}))
	.step(`Get Threshold`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {

		try {
			const strategy = ctx.message.text.split(' ')[1].toLowerCase();

			if (!checkStrategy(strategy)) throw new Error();

			ctx.wizard.state.strategy = strategy;
		} catch (error) {
			await ctx.reply("⚠️ Please choose a valid strategy from your keyboard.", {
				...Markup.keyboard([
					[
						Markup.button.text(Buttons.percentageStrategy.text),
						Markup.button.text(Buttons.absoluteStrategy.text)
					]
				]).oneTime().resize()
			});
			
			return;
		}

		const message = [
			`Provide you threshold.`,
			`You will be notified when price cross this value.`
		];

		await ctx.reply(message.join("\n"), {
			...Markup.inlineKeyboard([
				[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
			])
		})

		return ctx.wizard.next();
	}))
	.step(`Accept Token Data`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/^\d+$/, async (ctx) => {
		const threshold = Number(ctx.message.text);
		if (isNaN(threshold)) {
			await ctx.reply(`⚠️ Please provide a valid positive number.`, {
				...Markup.inlineKeyboard([
					[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
				])
			})
			return ;
		}

		ctx.wizard.state.threshold = threshold;

		const message = [
			`Your information:`,
			`Symbol: ${ctx.wizard.state.symbol}`,
			`Strategy: ${ctx.wizard.state.strategy}`,
			`Threshold: ${ctx.wizard.state.threshold}`
		];

		await ctx.reply(message.join("\n"));

		return await ctx.scene.leave();
	}))
	.build();