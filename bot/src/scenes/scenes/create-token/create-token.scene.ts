import { Scenes, Markup, Composer } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons } from '#ui/index.js';
import { MyContext } from "#context/context.interface.js";
import { checkStrategy, checkYesCancel } from "#lib/helpers/helpers.js";
import { container } from "#di/containers.js";
import { ApiService } from "#lib/api/api.service.js";
import { TYPES } from "#di/types.js";
import { ApiError } from "#errors/errors/api.error.js";
import { menuOption } from "#ui/menu/menu.js";
import { ResponseToken } from "#lib/api/response.js";


interface ICreateTokenSceneWizard extends Scenes.WizardSessionData { 
	symbol: string;
	price: number;
	strategy: 'percentage' | 'absolute';
	threshold: number;
}

export const createTokenScene = SceneBuilder
	.create<ICreateTokenSceneWizard>(SceneTitle.CREATE_TOKEN)
	.step(`Get Token Symbol`, async (ctx) => {
		const message = [
			`🪙 What's the token symbol ?`,
			`❗ Currently, i work only with Binance.`
		];

		await ctx.reply(message.join("\n"), {
			parse_mode: "HTML",
			...Markup.inlineKeyboard([
				[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
			])
		});

		return ctx.wizard.next();
	})
	.step(`Get Strategy`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {
		ctx.wizard.state.symbol = ctx.message.text;

		const message = [
			`🎯 Which strategy to notify would you like to use ?`
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

			const message = [
				`⚖️ Provide you threshold.`,
				`<i>You will be notified when price cross this value.</i>`
			];

			await ctx.reply(message.join("\n"), {
				parse_mode: "HTML",
				...Markup.inlineKeyboard([
					[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
				])
			})

			return ctx.wizard.next();
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
	}))
	.step(`Accept Token Data`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/^\d+(\.\d+)?$/, async (ctx) => {
		try {
			const threshold = Number(ctx.message.text);
			if (isNaN(threshold) || threshold <= 0) {
				await ctx.reply(`⚠️ Please provide a valid positive number.`, {
					...Markup.inlineKeyboard([
						[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
					])
				})
				return ;
			}

			ctx.wizard.state.threshold = threshold;

			const apiService = container.get<ApiService>(TYPES.ApiService);

			const tokenData = await apiService.get<ResponseToken>(
				ApiService.TOKEN_URL + '/' + ctx.wizard.state.symbol,
				ctx.session
			);

			ctx.wizard.state.symbol = tokenData.symbol;
			ctx.wizard.state.price = tokenData.price;

			const endingForThreshold = ctx.wizard.state.strategy === "percentage" ? "%" : "$";

			const message = [
				`💡 Shall we lock this in... or retrace our steps?`,
				`<i>Symbol</i>: <b>${ctx.wizard.state.symbol}</b>`,
				`<i>Price</i>: <b>${ctx.wizard.state.price}$</b>`,
				`<i>Strategy</i>: <b>${ctx.wizard.state.strategy}</b>`,
				`<i>Threshold</i>: <b>${ctx.wizard.state.threshold}${endingForThreshold}</b>`
			];
	
			await ctx.reply(message.join("\n"), {
				parse_mode: "HTML",
				...Markup.keyboard([
					[ 
						Markup.button.text(Buttons.yesBtn.text),
						Markup.button.text(Buttons.cancelBtn.text)
					]
				]).oneTime().resize()
			});

			return ctx.wizard.next();
		} catch (error: any) {
			if (error instanceof ApiError) {
				await ctx.reply(
					error.botMessage,
					menuOption().options
				);
				return ctx.scene.leave();
			}

			await ctx.reply(
				error.message,
				menuOption().options
			);
			return ctx.scene.leave();
		}
}))
	.step(`Send Token Data to Server`, new Composer<MyContext<ICreateTokenSceneWizard>>().hears(/.*/, async (ctx) => {
		try {
			const answer = ctx.message.text.split(' ')[1].toLowerCase();
			if (!checkYesCancel(answer)) throw new Error();
	
			const apiService = container.get<ApiService>(TYPES.ApiService);

			switch (answer) {
				case "yes":
					await apiService.post(
						ApiService.CREATE_URL, 
						{
							userId: ctx.from.id,
							target: {
								type: "token",
								symbol: ctx.wizard.state.symbol,
								lastNotifiedPrice: ctx.wizard.state.price
							},
							strategy: {
								type: ctx.wizard.state.strategy,
								threshold: ctx.wizard.state.threshold
							}
						}, 
						ctx.session
					);
	
					await ctx.reply(
						`✅ Token Subscription created successfully.`, 
						menuOption().options
					);
					break;
				case "cancel":
					await ctx.reply(menuOption().text, menuOption().options);
					break;
				default:
					break;
			}
	
			return ctx.scene.leave();
		} catch (error) {
			if (error instanceof ApiError) {
				await ctx.reply(
					error.botMessage,
					menuOption().options
				);
				return ctx.scene.leave();
			}
			
			await ctx.reply(
				`⚠️ An error occurred while creating the token subscription. Please try again later.`,
				menuOption().options
			);
			return ctx.scene.leave();
		}	
	}))
	.build();