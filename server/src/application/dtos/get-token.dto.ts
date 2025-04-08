import { TokenResponse } from "#infrastructure/lib/apis/binance/response.interfaces.js";

export class GetTokenDto {
	public readonly symbol: string;
	public readonly price: number;
	constructor (
		t: TokenResponse
	) {
		this.symbol = t.symbol;
		this.price = t.price;
	}
}