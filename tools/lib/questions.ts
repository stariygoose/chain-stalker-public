import inquirer from 'inquirer';

import { DefaultValues, Rows } from './values.js';


export const defaultQuestions = async () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: Rows.TG_BOT_TOKEN,
      message: '[REQUIRED] Your Telegram Bot Auth Token:',
    },
    {
      type: 'input',
      name: Rows.TG_BOT_NAME,
      message: '[REQUIRED] Your Telegram Bot Username (without @ prefix):',
			validate: (value) => /^[^@]*$/.test(value),
    },
    {
      type: 'input',
      name: Rows.OPENSEA_TOKEN,
      message: '[REQUIRED] Your Opensea Auth Token:',
    },
		{
			type: 'confirm',
			name: 'CONFIGURE_CUSTOM_JWTS',
			message: "Would you like to provide your own JWT secret phrases? (recommended for security)",
			default: false
		},
		{
			type: 'confirm',
			name: 'CONFIGURE_CUSTOM_PORTS',
			message: 'Do you want to set custom ports for the bot, server, database, and Redis, or keep the defaults?',
			default: false
		},
    {
			type: 'confirm',
			name: 'CONFIGURE_CUSTOM_DB',
			message: 'Do you want to configure custom database credentials (recommended for security)?',
			default: false
		},
		{
			type: 'confirm',
			name: 'CONFIGURE_CUSTOM_REDIS',
			message: 'Do you want to configure custom redis credentials (recommended for security)?',
			default: false
		}
  ]);
};

export const customJwtSecretsQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.JWT_ACCESS_SECRET,
			message: `Your secret for access token:`,
			default: `${DefaultValues.JWTS.ACCESS}`
		},
		{
			type: 'input',
			name: Rows.JWT_REFRESH_SECRET,
			message: `Your secret for refresh token:`,
			default: `${DefaultValues.JWTS.REFRESH}`
		}
	]);
}

export const customPortsQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.DB_PORT,
			message: `Enter the database port:`,
			default: `${DefaultValues.PORTS.DB}`
		},
		{
			type: 'input',
			name: Rows.TG_BOT_PORT,
			message: `Enter the port for the telegram bot service:`,
			default: `${DefaultValues.PORTS.BOT}`
		},
		{
			type: 'input',
			name: Rows.SERVER_PORT,
			message: `Enter the port for the backend server:`,
			default: `${DefaultValues.PORTS.SERVER}`
		},
		{
			type: 'input',
			name: Rows.REDIS_PORT,
			message: `Enter the port for the redis service:`,
			default: `${DefaultValues.PORTS.REDIS}`
		},
	]);
}

export const customDbQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.DB_ROOT_USERNAME,
			message: `Set admin username:`,
			default: `${DefaultValues.DATABASE.ADMIN}`
		},
		{
			type: 'password',
			mask: '*',
			name: Rows.DB_ROOT_PASSWORD,
			message: `Set admin password:`,
			default: `${DefaultValues.DATABASE.ADMIN}`
		},
		{
			type: 'input',
			name: Rows.DB_DATABASE,
			message: `Set your database name:`,
			default: `${DefaultValues.DATABASE.NAME}`
		},
		{
			type: 'input',
			name: Rows.DB_USER,
			message: `Set your user name:`,
			default: `${DefaultValues.DATABASE.USER}`
		},
		{
			type: 'password',
			mask: '*',
			name: Rows.DB_PASS,
			message: `Set your user password:`,
			default: `${DefaultValues.DATABASE.USER_PASSWORD}`
		},
	]);
}

export const customRedisQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.REDIS_HOST,
			message: `Set your redis host:`,
			default: `${DefaultValues.REDIS.HOST}`
		},
		{
			type: 'password',
			mask: '*',
			name: Rows.REDIS_PASSWORD,
			message: `Set your redis password:`,
			default: `${DefaultValues.REDIS.PASS}`
		},
	]);
}