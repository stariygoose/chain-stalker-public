import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, '../..');
console.log(rootDir);

export const Rows = {
	OPENSEA_TOKEN: 'OPENSEA_TOKEN',
	TG_BOT_TOKEN: 'TG_BOT_TOKEN',
	TG_BOT_NAME: 'TG_BOT_NAME',
	NODE_MODE: 'NODE_MODE',
	DB_PORT: 'DB_PORT',
	TG_BOT_PORT: 'TG_BOT_PORT',
	SERVER_PORT: 'SERVER_PORT',
	REDIS_PORT: 'REDIS_PORT',
	DB_ROOT_USERNAME: 'DB_ROOT_USERNAME',
	DB_ROOT_PASSWORD: 'DB_ROOT_PASSWORD',
	DB_DATABASE: 'DB_DATABASE',
	DB_USER: 'DB_USER',
	DB_PASS: 'DB_PASS',
	REDIS_HOST: 'REDIS_HOST',
	REDIS_PASSWORD: 'REDIS_PASSWORD',
	JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
	JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET'
} as const;

export type EnvKeys = keyof typeof Rows;

export const DefaultValues = {
	PORTS: {
		REDIS: 25004,
		DB: 25003,
		BOT: 25002,
		SERVER: 25001
	},
	DATABASE: {
		NAME: 'chainstalker',

		ADMIN: 'admin',
		ADMIN_PASS: 'very_strong_admin_password',

		USER: 'user',
		USER_PASSWORD: 'very_strong_user_password'
	},
	REDIS: {
		HOST: 'redis',
		PASS: 'very_strong_redis_password'
	},
	JWTS: {
		ACCESS: 'jwt_access_secret',
		REFRESH: 'jwt_refresh_secret'
	}
}

export const Placeholders = {
	DB_PORT: 'YOUR_DB_PORT',	
}