import axios from "axios";
import { injectable } from "inversify";

import { TokenTickerData } from "#infrastructure/lib/apis/binance/requests.interfaces.js";
import { TokenResponse } from "#infrastructure/lib/apis/binance/response.interfaces.js";
import { LayerError } from "#infrastructure/errors/index.js";


@injectable()
export class BinanceAPI {
	private readonly _baseUrl: string = `https://data-api.binance.vision/api/v3`;
	private readonly _headers: Record<string, string>;

	constructor () {
		this._headers = {
			"accept": "application/json"
		};
	}

	public async getCoin(s: string): Promise<TokenResponse> {
		try {
			const url = this._baseUrl + `/ticker/price?symbol=${s.toUpperCase()}USDT`;
			
			const res = await axios.get<TokenTickerData>(url, {
				headers: this._headers
			});
			
			const { symbol, lastPrice } = res.data;

			const token: TokenResponse = {
				symbol: symbol,
				price: Number(lastPrice)
			}

			return token;
		} catch (error: any) {
			if (error.response.status === 400) {
				throw new LayerError.NotFoundError(`Cannot find a token by the provided symbol.`);
			}
			throw new LayerError.ExternalApiError();
		}
	}
}