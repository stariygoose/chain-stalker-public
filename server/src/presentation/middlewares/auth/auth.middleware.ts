import { Request, NextFunction } from 'express';

import { IJwtService } from '#application/services/jwt.service.js';
import { container } from '#di/inversify.config.js';
import { TYPES } from '#di/types.js';
import { ApiError } from '#infrastructure/errors/index.js';


export const authenticateJWT = (
	req: Request,
	next: NextFunction
) => {
	const url = req.originalUrl;
	if (url.includes('/auth/bot-login') || url.includes('/auth/refresh')) {
		return next();
	}

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError.UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

	const jwtService = container.get<IJwtService>(TYPES.JwtService);

	const isValid = jwtService.validateAccessToken(token);

	if (!isValid) throw new ApiError.UnauthorizedError('Invalid access token');

	next();
};
