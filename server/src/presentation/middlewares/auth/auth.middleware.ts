import { Request, Response, NextFunction } from 'express';

import { IJwtService } from '#application/services/jwt.service.js';
import { container } from '#di/inversify.config.js';
import { TYPES } from '#di/types.js';
import { ApiError } from '#infrastructure/errors/index.js';


export interface AuthenticatedRequest extends Request {
	context: {
		userId: number;
	};
}

export const authenticateJWT = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const typedReq = req as AuthenticatedRequest;
	typedReq.context = {
		userId: 0,
	}

	const url = req.originalUrl;
	if (url.includes('/auth/bot-login') || url.includes('/auth/refresh')) {
		return next();
	}

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError.UnauthorizedError('Missing or invalid Authorization header');
  }

	try {
		const token = authHeader.split(' ')[1];

		const jwtService = container.get<IJwtService>(TYPES.JwtService);
	
		const decodeAccessToken = jwtService.decodeAccessToken(token) as { userId: number };

		typedReq.context.userId = decodeAccessToken.userId;

		next();
	} catch (error: unknown) {
		return next(new ApiError.UnauthorizedError('Invalid access token'));
	}
};
