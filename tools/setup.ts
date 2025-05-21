// tools/setup.ts
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');

const Rows = {
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
type EnvKeys = keyof typeof Rows;

const DefaultValues = {
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

const logHeader = () => {
  const title = figlet.textSync('Chain Stalker', {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
  });
  const boxed = boxen(chalk.cyan(title), {
    padding: 1,
    borderColor: 'green',
    borderStyle: 'round',
    align: 'center'
  });
  console.log(boxed);
};

const defaultQuestions = async () => {
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

const customJwtSecretsQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.JWT_ACCESS_SECRET,
			message: `Your secret for access token (default: ${DefaultValues.JWTS.ACCESS}):`,
			default: `${DefaultValues.JWTS.ACCESS}`
		},
		{
			type: 'input',
			name: Rows.JWT_REFRESH_SECRET,
			message: `Your secret for refresh token (default: ${DefaultValues.JWTS.REFRESH}):`,
			default: `${DefaultValues.JWTS.REFRESH}`
		}
	]);
}

const customPortsQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.DB_PORT,
			message: `Enter the database port (default: ${DefaultValues.PORTS.DB}):`,
			default: `${DefaultValues.PORTS.DB}`
		},
		{
			type: 'input',
			name: Rows.TG_BOT_PORT,
			message: `Enter the port for the telegram bot service (default: ${DefaultValues.PORTS.BOT}):`,
			default: `${DefaultValues.PORTS.BOT}`
		},
		{
			type: 'input',
			name: Rows.SERVER_PORT,
			message: `Enter the port for the backend server (default: ${DefaultValues.PORTS.SERVER}):`,
			default: `${DefaultValues.PORTS.SERVER}`
		},
		{
			type: 'input',
			name: Rows.REDIS_PORT,
			message: `Enter the port for the redis service (default: ${DefaultValues.PORTS.REDIS}):`,
			default: `${DefaultValues.PORTS.REDIS}`
		},
	]);
}

const customDbQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.DB_ROOT_USERNAME,
			message: `Set admin username (default: ${DefaultValues.DATABASE.ADMIN}):`,
			default: `${DefaultValues.DATABASE.ADMIN}`
		},
		{
			type: 'password',
			mask: 'yes',
			name: Rows.DB_ROOT_PASSWORD,
			message: `Set admin password (default: ${DefaultValues.DATABASE.ADMIN_PASS}):`,
			default: `${DefaultValues.DATABASE.ADMIN}`
		},
		{
			type: 'input',
			name: Rows.DB_DATABASE,
			message: `Set your database name (default: ${DefaultValues.DATABASE.NAME}):`,
			default: `${DefaultValues.DATABASE.NAME}`
		},
		{
			type: 'input',
			name: Rows.DB_USER,
			message: `Set your user name (default: ${DefaultValues.DATABASE.USER}):`,
			default: `${DefaultValues.DATABASE.USER}`
		},
		{
			type: 'password',
			mask: 'yes',
			name: Rows.DB_PASS,
			message: `Set your user password (default: ${DefaultValues.DATABASE.USER_PASSWORD}):`,
			default: `${DefaultValues.DATABASE.USER_PASSWORD}`
		},
	]);
}

const customRedisQuestions = async () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: Rows.REDIS_HOST,
			message: `Set your redis host (default: ${DefaultValues.REDIS.HOST}):`,
			default: `${DefaultValues.REDIS.HOST}`
		},
		{
			type: 'password',
			mask: 'yes',
			name: Rows.REDIS_PASSWORD,
			message: `Set your redis password (default: ${DefaultValues.REDIS.PASS}):`,
			default: `${DefaultValues.REDIS.PASS}`
		},
	]);
}

const generateEnv = (answers: Record<EnvKeys, string>) => {
  const envContent = [
		`# ! REQUIRED SECTION. You must provide all of these variables with your own data.`,
		`# ! Without these 3 variables, the application will not work.`,
		`# ! ----------------------------------------------------------------------`,
		`${Rows.OPENSEA_TOKEN}		=${answers.OPENSEA_TOKEN}`,
		`${Rows.TG_BOT_TOKEN}			=${answers.TG_BOT_TOKEN}`,
		`${Rows.TG_BOT_NAME}			=${answers.TG_BOT_NAME}`,
		`# ! ----------------------------------------------------------------------`,
		``,
		`# <dev> or <prod> by using dev you will see debug logs in console.`,
		`${Rows.NODE_MODE}				=prod`,
		`# Ports section`,
		`${Rows.DB_PORT}					=${answers.DB_PORT}`,
		`${Rows.TG_BOT_PORT}			=${answers.TG_BOT_PORT}`,
		`${Rows.SERVER_PORT}			=${answers.SERVER_PORT}`,
		`${Rows.REDIS_PORT}				=${answers.REDIS_PORT}`,
		``,
		`# Database section.`,
		`${Rows.DB_ROOT_USERNAME}	=${answers.DB_ROOT_USERNAME}`,
		`${Rows.DB_ROOT_PASSWORD}	=${answers.DB_ROOT_PASSWORD}`,
		`${Rows.DB_DATABASE}			=${answers.DB_DATABASE}`,
		`${Rows.DB_USER}					=${answers.DB_USER}`,
		`${Rows.DB_PASS}					=${answers.DB_PASS}`,
		``,
		`# Redis section.`,
		`${Rows.REDIS_HOST}				=${answers.REDIS_HOST}`,
		`${Rows.REDIS_PASSWORD}		=${answers.REDIS_PASSWORD}`,
		``,
		`# JWT TOKENS`,
		`${Rows.JWT_ACCESS_SECRET}=${answers.JWT_ACCESS_SECRET}`,
		`${Rows.JWT_REFRESH_SECRET}=${answers.JWT_REFRESH_SECRET}`
	];

  const envPath = path.join(rootDir, '.env.test');

  fs.writeFileSync(envPath, envContent.join('\n'));

  console.log(chalk.green(`\n✅ .env file created at ${envPath}`));
};

const run = async () => {
	const answers: Record<string, any> = {};

  logHeader();

  const defaults = await defaultQuestions();
	Object.assign(answers, defaults);

	// JWT SESCRETS CONFIGURATION
	if (answers.CONFIGURE_CUSTOM_JWTS) {
		const customJwtSecrets = await customJwtSecretsQuestions();
		Object.assign(answers, customJwtSecrets);
	} else {
		Object.assign(answers, {
			JWT_ACCESS_SECRET: DefaultValues.JWTS.ACCESS,
			JWT_REFRESH_SECRET: DefaultValues.JWTS.REFRESH
		});
	}

	// PORTS CONFIGURATION
  if (answers.CONFIGURE_CUSTOM_PORTS) {
		const customPorts = await customPortsQuestions();
    Object.assign(answers, customPorts);
  } else {
		Object.assign(answers, {
			DB_PORT: DefaultValues.PORTS.DB,
			TG_BOT_PORT: DefaultValues.PORTS.BOT,
			SERVER_PORT: DefaultValues.PORTS.SERVER,
			REDIS_PORT: DefaultValues.PORTS.REDIS
		});
	}

	// DB CREDENTIALS
	if (answers.CONFIGURE_CUSTOM_DB) {
		const customDbCredentials = await customDbQuestions();
		Object.assign(answers, customDbCredentials);
	} else {
		Object.assign(answers, {
			DB_ROOT_USERNAME: DefaultValues.DATABASE.ADMIN,
			DB_ROOT_PASSWORD: DefaultValues.DATABASE.ADMIN_PASS,
			DB_DATABASE: DefaultValues.DATABASE.NAME,
			DB_USER: DefaultValues.DATABASE.USER,
			DB_PASS: DefaultValues.DATABASE.USER_PASSWORD
		});
	}

	// REDIS CREDENTIALS
	if (answers.CONFIGURE_CUSTOM_REDIS) {
		const customRedisCredentials = await customRedisQuestions();
		Object.assign(answers, customRedisCredentials);
	} else {
		Object.assign(answers, {
			REDIS_HOST: DefaultValues.REDIS.HOST,
			REDIS_PASSWORD: DefaultValues.REDIS.PASS
		});
	}

	generateEnv(answers);
};

run().catch((err) => {
	if (err instanceof Error && err.name === 'ExitPromptError') {
		console.error(chalk.red('❌ Setup was interrupted. No config was saved.\n'))
		process.exit(0);
	}
  console.error(chalk.red('❌ Setup failed:'), err);
  process.exit(1);
});
