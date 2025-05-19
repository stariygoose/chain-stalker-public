import { Scenes, Markup, Composer } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons, ChainStalkerMessage } from '#ui/index.js';
import { MyContext } from "#context/context.interface.js";
import { checkStrategy, checkYesCancel } from "#lib/helpers/helpers.js";
import { container, TYPES } from "#di/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ApiError } from "#errors/errors/api.error.js";
import { menuOption } from "#ui/menu/menu.js";


export interface ICreateCollectionSceneWizard extends Scenes.WizardSessionData { 
	slug: string;
	name: string;
	chain: string;
	symbol: string;
	floorPrice: number;
	strategy: 'percentage' | 'absolute';
	threshold: number;
}

export const createCollectionScene = SceneBuilder
	.create<ICreateCollectionSceneWizard>(SceneTitle.CREATE_COLLECTION)
	.step(`Get Collection Slug`, async (ctx) => {
		await ctx.reply(
			ChainStalkerMessage.SMS.GET_SLUG,
			{
				parse_mode: "HTML",
				...Markup.inlineKeyboard([
					[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
				])
			}
		);

		return ctx.wizard.next();
	})
	.step(`Get Strategy`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/.*/, async (ctx) => {
		const slug = ctx.message.text;

		if (!/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/.test(slug)) {
			await ctx.reply(
				ChainStalkerMessage.SMS.INVALID_SLUG,
				{
					...Markup.inlineKeyboard([
						[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
					])
				}
			)
			return ;
		}

		ctx.wizard.state.slug = slug;

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
	.step(`Get Threshold`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/.*/, async (ctx) => {
		try {
			const strategy = ctx.message.text.split(' ')[1].toLowerCase();

			if (!checkStrategy(strategy)) throw new Error('Invalid strategy type');

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
	.step(`Accept Collection Data`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/^\d+$/, async (ctx) => {
		const threshold = Number(ctx.message.text);
		if (isNaN(threshold)) {
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

		try {
			const apiService = container.get<ApiService>(TYPES.ApiService);
			
			const collectionData = await apiService.getNftCollection(
				ctx,
				ctx.wizard.state.slug
			);

			ctx.wizard.state.slug = collectionData.slug;
			ctx.wizard.state.name = collectionData.name;
			ctx.wizard.state.chain = collectionData.chain;
			ctx.wizard.state.symbol = collectionData.symbol;
			ctx.wizard.state.floorPrice = collectionData.floorPrice;

			await ctx.reply(
				ChainStalkerMessage.SMS.COLLECTION_INFO(
					collectionData.openseaUrl,
					ctx
				), 
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

		return ctx.wizard.next();
	}))
	.step(`Send Token Data to Server`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/.*/, async (ctx) => {
		const { text, options } = menuOption();
	
		try {
			const answer = ctx.message.text.split(' ')[1].toLowerCase();
			if (!checkYesCancel(answer)) throw new Error(`Invalid submition of collection (Waiting for yes/cancel, received: ${ctx.message.text})`);
	
			const apiService = container.get<ApiService>(TYPES.ApiService);

			switch (answer) {
				case "yes":
					await apiService.createNftSubscription(ctx);
					await ctx.reply(
						ChainStalkerMessage.SMS.COLLECTION_CREATED, 
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
					error.message,
					options
				);
				return ctx.scene.leave();
			}
			
			await ctx.reply(
				`⚠️ An error occurred while creating the collection subscription. Please try again later.`,
				options
			);
			
			return ctx.scene.leave();
		}	
	}))
	.build();