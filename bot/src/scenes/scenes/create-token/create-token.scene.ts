import { Scenes, Markup, Composer } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons, ChainStalkerMessage } from '#ui/index.js';
import { MyContext } from "#context/context.interface.js";
import { checkStrategy, checkYesCancel } from "#lib/helpers/helpers.js";
import { container } from "#di/containers.js";
import { ApiService } from "#lib/api/api.service.js";
import { TYPES } from "#di/types.js";
import { ApiError } from "#errors/errors/api.error.js";
import { menuOption } from "#ui/menu/menu.js";
import { ResponseToken } from "#lib/api/response.js";


export interface ICreateTokenSceneWizard extends Scenes.WizardSessionData { 
	symbol: string;
	price: number;
	strategy: 'percentage' | 'absolute';
	threshold: number;
}

export const createTokenScene = SceneBuilder
	.create<ICreateTokenSceneWizard>(SceneTitle.CREATE_TOKEN)
	.step(`Get Token Symbol`, async (ctx) => {

		await ctx.reply(
			ChainStalkerMessage.SMS.GET_SYMBOL,
			 {
				parse_mode: "HTML",
				...Markup.inlineKeyboard([
					[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
				])
			}
		);

		return ctx.wizard.next();
	})
	.step(`Get Strategy`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {
		ctx.wizard.state.symbol = ctx.message.text;

		await ctx.reply(
			ChainStalkerMessage.SMS.GET_STRATEGY,
			{
				...Markup.keyboard([
					[
						Markup.button.text(Buttons.percentageStrategy.text),
						Markup.button.text(Buttons.absoluteStrategy.text)
					]
				]).oneTime().resize()
			}
		);

		return ctx.wizard.next();
	}))
	.step(`Get Threshold`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {
		try {
			const strategy = ctx.message.text.split(' ')[1].toLowerCase();

			if (!checkStrategy(strategy)) throw new Error();

			ctx.wizard.state.strategy = strategy;

			await ctx.reply(
				ChainStalkerMessage.SMS.GET_THRESHOLD, 
				{
					parse_mode: "HTML",
					...Markup.inlineKeyboard([
						[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
					])
				}
			);

			return ctx.wizard.next();
		} catch (error) {
			await ctx.reply(
				ChainStalkerMessage.SMS.INVALID_STRATEGY,
				{
					...Markup.keyboard([
						[
							Markup.button.text(Buttons.percentageStrategy.text),
							Markup.button.text(Buttons.absoluteStrategy.text)
						]
					]).oneTime().resize()
				}
			);
			
			return;
		}
	}))
	.step(`Accept Token Data`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/^\d+(\.\d+)?$/, async (ctx) => {
		try {
			const threshold = Number(ctx.message.text);
			if (isNaN(threshold) || threshold <= 0) {
				await ctx.reply(
					ChainStalkerMessage.SMS.INVALID_THRESHOLD, 
					{
						...Markup.inlineKeyboard([
							[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
						])
					}
				);
				return ;
			}

			ctx.wizard.state.threshold = threshold;

			const apiService = container.get<ApiService>(TYPES.ApiService);

			const tokenData = await apiService.getToken(
				ctx, 
				ctx.wizard.state.symbol
			);

			ctx.wizard.state.symbol = tokenData.symbol;
			ctx.wizard.state.price = tokenData.price;
	
			await ctx.reply(
				ChainStalkerMessage.SMS.TOKEN_INFO(ctx), 
				{
					parse_mode: "HTML",
					...Markup.keyboard([
						[ 
							Markup.button.text(Buttons.yesBtn.text),
							Markup.button.text(Buttons.cancelBtn.text)
						]
					]).oneTime().resize()
				}
			);

			return ctx.wizard.next();
		} catch (error: any) {
			const { options } = menuOption();

			if (error instanceof ApiError) {
				await ctx.reply(
					error.botMessage,
					options
				);
				return ctx.scene.leave();
			}

			await ctx.reply(
				error.message,
				options
			);
			return ctx.scene.leave();
		}
	}))
	.step(`Send Token Data to Server`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {
		const { text, options } = menuOption();
		
		try {
			const answer = ctx.message.text.split(' ')[1].toLowerCase();
			if (!checkYesCancel(answer)) throw new Error();
	
			const apiService = container.get<ApiService>(TYPES.ApiService);

			switch (answer) {
				case "yes":
					await apiService.createTokenSubscription(ctx);
					await ctx.reply(
						`✅ Token Subscription created successfully.`, 
						options
					);
					break;
				case "cancel":
					await ctx.reply(
						text,
						options
					);
					break;
				default:
					break;
			}
	
			return ctx.scene.leave();
		} catch (error) {
			if (error instanceof ApiError) {
				await ctx.reply(
					error.botMessage,
					options
				);
				return ctx.scene.leave();
			}
			
			await ctx.reply(
				ChainStalkerMessage.SMS.TOKEN_CREATION_FAILED,
				options
			);
			return ctx.scene.leave();
		}	
	}))
	.build();