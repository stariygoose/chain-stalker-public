import axios from "axios";
import { injectable } from "inversify";

import { TokenTickerData } from "#infrastructure/lib/apis/binance/requests.interfaces.js";
import { TokenResponse } from "#infrastructure/lib/apis/binance/response.interfaces.js";
import { ApiError } from "#infrastructure/errors/index.js";

@injectable()
export class BinanceAPI {
  private readonly _baseUrl: string = `https://data-api.binance.vision/api/v3`;
  private readonly _headers: Record<string, string>;

  constructor() {
    this._headers = {
      accept: "application/json",
    };
  }

  public async getCoin(s: string): Promise<TokenResponse> {
    try {
      const url = this._baseUrl + `/ticker/price?symbol=${s.toUpperCase()}USDT`;

      const res = await axios.get<TokenResponse>(url, {
        headers: this._headers,
      });

      const { price } = res.data;

      const nPrice = Number(price);

      if (isNaN(nPrice))
        throw new ApiError.ExternalApiError(
          `A token price from Binance API is NaN.`,
        );

      const token: TokenResponse = {
        symbol: s.toUpperCase(),
        price: nPrice,
      };

      return token;
    } catch (error: any) {
      throw new ApiError.ExternalApiError(
        `A token <${s}> may not be supported by Binance.`,
      );
    }
  }
}

