import { ICoin, ICollection, IUserContext } from "../types/interfaces.js";

class UserStateManager {
	private userStates: Map<number, IUserContext<ICollection | ICoin>>;
	constructor() {
		this.userStates = new Map();
	}

	public getState(chatId: number): IUserContext<ICollection | ICoin> {
		return this.userStates.get(chatId) || {
			state: null,
			prevMsgId: null,
			btnType: null,
			network: null,
			contract: null,
			percentage: null,
			target: null
		};
	}

	public setState(chatId: number, context: Partial<IUserContext<ICollection | ICoin>>) {
		const currentContext = this.getState(chatId);
		this.userStates.set(chatId, {...currentContext, ...context});
	}

	public resetState(chatId: number) {
		this.userStates.set(chatId, {
			state: null,
			prevMsgId: null,
			btnType: null,
			network: null,
			contract: null,
			percentage: null,
			target: null
		});
	}
}

export {UserStateManager}