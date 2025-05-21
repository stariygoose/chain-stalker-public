import { inject, injectable } from "inversify";

import { IJwtTokenRepository } from "#application/repository/jwt.repository.js";
import { AbstractDatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";
import { TYPES } from "#di/types.js";
import { ILogger } from "#utils/logger.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { JwtModel } from "#infrastructure/database/mongodb/models/jwt/jwt.model.js";
import { JwtDbRecord } from "#infrastructure/dtos/jwt/jwt.dto.js";


@injectable()
export class JwtTokenRepository implements IJwtTokenRepository {
	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
	) {}

	public async findToken(refreshToken: string): Promise<JwtDbRecord | null> {
		try {
			const token = await JwtModel.findOne({ refreshToken }).lean<JwtDbRecord>();
			
			if (!token) return null;

			return token;

		} catch (error: unknown){
			this._handleDbError(error);
		}
	}

	public async updateRefreshToken(oldRefreshToken: string, newRefreshToken: string): Promise<JwtDbRecord | null> {
		try {
			const token = await JwtModel.findOneAndUpdate(
				{ refreshToken: oldRefreshToken },
				{ refreshToken: newRefreshToken },
				{ new: true }
			).lean<JwtDbRecord>();

			if (!token) return null;

			return token;

		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	public async saveToken(userId: number, refreshToken: string): Promise<void> {
		try {
			await JwtModel.create({
				userId,
				refreshToken
			});
		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	private _handleDbError(error: unknown): never {
		if (error instanceof AbstractDatabaseError) {
			this._logger.error(error.message);
			throw error;
		}
	
		this._logger.error(`Unexpected Database Error. Reason: ${(error as Error).message}`);
		throw new LayerError.DatabaseError('Unexpected Database Error.');
	}
}