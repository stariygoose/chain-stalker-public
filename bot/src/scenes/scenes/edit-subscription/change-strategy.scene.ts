import { Composer, Markup, Scenes } from "telegraf";

import { SceneBuilder } from "#scenes/scenes/scene.builder.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons } from "#ui/index.js";
import { MyContext } from "#context/context.interface.js";
import { checkStrategy } from "#lib/helpers/helpers.js";
import { container, TYPES } from "#di/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ApiError } from "#errors/errors/api.error.js";
import { menuOption } from "#ui/menu/menu.js";
import { COMMAND_TYPES } from "#di/types.js";
import { EditSubscriptionCommand } from "#handlers/commands/commands/edit-subscription.command.js";


interface IChangeStrategyScene extends Scenes.WizardSessionData {
	strategy?: {
		type?: 'percentage' | 'absolute';
		threshold?: number;
	}
}

export const changeStrategyScene = new SceneBuilder<IChangeStrategyScene>(SceneTitle.CHANGE_STRATEGY)
	.step('Ask for a strategy', async (ctx) => {
		ctx.wizard.state.strategy = {};

		const message = [
			"Patterns await interpretation. Input your alert algorithm. 🎯"
		];

		try {
			await ctx.reply(
				message.join('\n'),
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
		} catch (error: any) {
			await ctx.reply('Unknown error while trying to send a Change Strategy message');
		}
	})
	.step('Get a strategy from a user and send a threshold message', new Composer<MyContext<IChangeStrategyScene>>().hears(/.*/, async (ctx) => {
		try {
			const strategy = ctx.message.text.split(' ')[1].toLowerCase();
			
			if (!checkStrategy(strategy)) throw new Error();

			ctx.wizard.state.strategy!.type = strategy;

			const message = [
				'What fluctuation is worth pursuing? Set the threshold now.'
			];

			await ctx.reply(
				message.join('\n'),
				Markup.removeKeyboard()
			);

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
		}
	}))
	.step('Verify a threshold and send data to a server and a success message', new Composer<MyContext<IChangeStrategyScene>>().hears(/.*/, async (ctx) => {
		const { options } = menuOption();

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

			ctx.wizard.state.strategy!.threshold = threshold;

			const apiService = container.get<ApiService>(TYPES.ApiService);

			if (!ctx.session.targetToEdit) {
				await ctx.reply(
					'Target is not specified.'
				);
				throw new Error('Target to edit is undefined');
			}

			const { id } = ctx.session.targetToEdit;
			const { strategy } = ctx.wizard.state;

			await apiService.put(
				ApiService.STRATEGY_EDIT + '/' + id,
				{ strategy },
				ctx.session
			);

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