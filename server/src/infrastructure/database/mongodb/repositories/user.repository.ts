import { inject, injectable } from "inversify";

import { UserModel } from "#infrastructure/database/mongodb/models/users/user.model.js";
import { TYPES } from "#di/types.js";
import { ILogger } from "#utils/logger.js";
import { IUserRepository } from "#application/repository/user.repository.js";
import { AbstractDatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { UserDbRecord } from "#infrastructure/dtos/user/user.dto.js";


@injectable()
export class UserRepository implements IUserRepository {
	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {}

	public async findByUserId(userId: number): Promise<UserDbRecord | null> {
		try {
			const user = await UserModel.findOne({ userId }).lean<UserDbRecord>();

			if (!user) return null;

			return user;
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