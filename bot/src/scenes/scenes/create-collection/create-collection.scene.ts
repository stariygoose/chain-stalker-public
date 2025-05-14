import { Scenes, Markup, Composer } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons } from '#ui/index.js';
import { MyContext } from "#context/context.interface.js";
import { checkStrategy, checkYesCancel } from "#lib/helpers/helpers.js";
import { container, TYPES } from "#di/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ResponseCollection } from "#lib/api/response.js";
import { ApiError } from "#errors/errors/api.error.js";
import { menuOption } from "#ui/menu/menu.js";


interface ICreateCollectionSceneWizard extends Scenes.WizardSessionData { 
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
		const message = [
			`🖼️ What's the collection slug ?`,
			`❗ Currently, i work only with OpensSea.`
		];

		await ctx.reply(message.join("\n"), {
			parse_mode: "HTML",
			...Markup.inlineKeyboard([
				[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
			])
		});

		return ctx.wizard.next();
	})
	.step(`Get Strategy`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/.*/, async (ctx) => {
		const slug = ctx.message.text;

		if (!/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/.test(slug)) {
			const message = [
				`⚠️ This slug is not valid.`,
				`Examples of valid slugs: gemesis, pirate-apes`
			]
			await ctx.reply(message.join('\n'), {
				...Markup.inlineKeyboard([
					[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
				])
			})
			return ;
		}
		ctx.wizard.state.slug = slug;

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
	.step(`Get Threshold`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/.*/, async (ctx) => {
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
	.step(`Accept Collection Data`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/^\d+$/, async (ctx) => {
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

		try {
			const apiService = container.get<ApiService>(TYPES.ApiService);
			
			const collectionData = await apiService.get<ResponseCollection>(
				ApiService.COLLECTION_URL + '/' + ctx.wizard.state.slug,
				ctx.session
			);

			ctx.wizard.state.slug = collectionData.slug;
			ctx.wizard.state.name = collectionData.name;
			ctx.wizard.state.chain = collectionData.chain;
			ctx.wizard.state.symbol = collectionData.symbol;
			ctx.wizard.state.floorPrice = collectionData.floorPrice;

			const endingForThreshold = ctx.wizard.state.strategy === "percentage" ? "%" : "$";

			const message = [
				`💡 Shall we lock this in... or retrace our steps?`,
				`<i>Collection:</i> <a href="${collectionData.openseaUrl}">${ctx.wizard.state.name}</a>`,
				`<i>Slug</i>: <b>${ctx.wizard.state.slug}</b>`,
				`<i>Chain</i>: <b>${ctx.wizard.state.chain}</b>`,
				`<i>Floor Price</i>: <b>${ctx.wizard.state.floorPrice} ${ctx.wizard.state.symbol}</b>`,
				`<i>Strategy</i>: <b>${ctx.wizard.state.strategy}</b>`,
				`<i>Threshold</i>: <b>${ctx.wizard.state.threshold} ${endingForThreshold}</b>`
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

		return ctx.wizard.next();
	}))
	.step(`Send Token Data to Server`, new Composer<MyContext<ICreateCollectionSceneWizard>>().hears(/.*/, async (ctx) => {
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
								type: "nft",
								slug: ctx.wizard.state.slug,
								name: ctx.wizard.state.name,
								chain: ctx.wizard.state.chain,
								symbol: ctx.wizard.state.symbol,
								lastNotifiedPrice: ctx.wizard.state.floorPrice
							},
							strategy: {
								type: ctx.wizard.state.strategy,
								threshold: ctx.wizard.state.threshold
							}
						}, 
						ctx.session
					);
	
					await ctx.reply(
						`✅ Collection Subscription created successfully.`, 
						menuOption().options
					);
					break;
				case "cancel":
					await ctx.reply(
						menuOption().text,
						menuOption().options
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
					menuOption().options
				);
				return ctx.scene.leave();
			}
			
			await ctx.reply(
				`⚠️ An error occurred while creating the collection subscription. Please try again later.`,
				menuOption().options
			);
			return ctx.scene.leave();
		}	
	}))
	.build();