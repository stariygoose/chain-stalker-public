import { inject, injectable } from "inversify";

import { GetTokenDto } from '#application/dtos/get-token.dto.js';
import { TYPES } from '#di/types.js';
import { BinanceAPI } from '#infrastructure/lib/apis/index.js';


export interface ITokenService {
	getToken(symbol: string): Promise<GetTokenDto>
}

@injectable()
export class TokenService implements ITokenService {
	constructor (
		@inject(TYPES.BinanceAPI)
		private readonly _binanceApi: BinanceAPI
	) {}

	public async getToken(symbol: string): Promise<GetTokenDto> {
		try {
			const token = await this._binanceApi.getCoin(symbol);

			return new GetTokenDto(token);
		} catch (error) {
			throw error;
		}
	}
}