import { inject, injectable } from "inversify";

import { IJwtService, IJwtTokens } from "#application/services/jwt.service.js";
import { TYPES } from "#di/types.js";
import { ApiError, LayerError } from '#infrastructure/errors/index.js';
import { IUserRepository } from '#application/repository/user.repository.js';


export interface IAuthService {
	botLogin(userId: number): Promise<IJwtTokens>;
	refreshToken(refreshToken: string): Promise<IJwtTokens>;
}

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.JwtService)
		private readonly _jwtService: IJwtService,
		@inject(TYPES.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	public async botLogin(userId: number): Promise<IJwtTokens> {
		try {
			const userMetaData = await this._userRepository.createUser(userId);

			const tokens = this._jwtService.generatePair({ ...userMetaData });

			await this._jwtService.saveToken(userId, tokens.refreshToken);

			return tokens;
			
		} catch (error: unknown) {
			if (error instanceof LayerError.DuplicateKeyDbError) {
				throw new ApiError.ConflictError(`User with id ${error.key} already exists`);
			}
			throw error;
		}
	}

	public async refreshToken(refreshToken: string): Promise<IJwtTokens> {
		try {
			const decoded = this._jwtService.validateRefreshToken(refreshToken);
			if (!decoded) throw new ApiError.UnauthorizedError('Invalid refresh token');

			const session = await this._jwtService.findToken(refreshToken);
			if (!session) throw new ApiError.NotFoundError('Refresh Token not found');

			const userMetaData = await this._userRepository.findByUserId(session.userId);
			if (!userMetaData) throw new ApiError.NotFoundError('User not found');

			const tokens = this._jwtService.generatePair({ userId: userMetaData.userId });
			
			return tokens;
		} catch (error: unknown) {
			throw error;
		}
	}
} 