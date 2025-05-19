import { Composer, Markup, Scenes } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons, ChainStalkerMessage } from "#ui/index.js";
import { MyContext } from "#context/context.interface.js";
import { checkStrategy } from "#lib/helpers/helpers.js";
import { container, TYPES } from "#di/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ApiError } from "#errors/errors/api.error.js";
import { menuOption } from "#ui/menu/menu.js";
import { COMMAND_TYPES } from "#di/types.js";
import { EditSubscriptionCommand } from "#handlers/commands/commands/edit-subscription.command.js";


export interface IChangeStrategyScene extends Scenes.WizardSessionData {
	strategy?: {
		type?: 'percentage' | 'absolute';
		threshold?: number;
	}
}

export const changeStrategyScene = new SceneBuilder<IChangeStrategyScene>(SceneTitle.CHANGE_STRATEGY)
	.step('Ask for a strategy', async (ctx) => {
		ctx.wizard.state.strategy = {};

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
	})
	.step('Get a strategy from a user and send a threshold message', new Composer<MyContext<IChangeStrategyScene>>().hears(/.*/, async (ctx) => {
		try {
			const strategy = ctx.message.text.split(' ')[1].toLowerCase();
			
			if (!checkStrategy(strategy)) throw new Error();

			ctx.wizard.state.strategy!.type = strategy;

			await ctx.reply(
				ChainStalkerMessage.SMS.GET_THRESHOLD,
				{
					parse_mode: "HTML",
					...Markup.removeKeyboard()
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
		}
	}))
	.step('Verify a threshold and send data to a server and a success message', new Composer<MyContext<IChangeStrategyScene>>().hears(/.*/, async (ctx) => {
		const { options } = menuOption();

		try {
			const threshold = Number(ctx.message.text);
			if (isNaN(threshold) || threshold <= 0) {
				await ctx.reply(ChainStalkerMessage.SMS.INVALID_THRESHOLD, 
					{
						...Markup.removeKeyboard(),
						...Markup.inlineKeyboard([
							[ Markup.button.callback(Buttons.cancelBtn.text, Buttons.cancelBtn.callback_data) ]
						])
					}
				);
				return ;
			}

			ctx.wizard.state.strategy!.threshold = threshold;

			const apiService = container.get<ApiService>(TYPES.ApiService);

			if (!ctx.session.targetToEdit) {
				await ctx.reply(ChainStalkerMessage.SMS.INVALID_TARGET);
				throw new Error('Target to edit is undefined');
			}
			const { id } = ctx.session.targetToEdit;

			await apiService.changeStrategy(ctx, id);

			const editCommand = container.get<EditSubscriptionCommand>(COMMAND_TYPES.EditSubscription);

			await editCommand.showSubscriptionInfo(ctx, id);

			await ctx.scene.leave();
		} catch (error: unknown) {
			if (error instanceof ApiError) {
				console.log(error.message);
				await ctx.reply(error.botMessage, options);
			}
			await ctx.scene.leave();
		}
	}))
	.build();