import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { EnvKeys, Placeholders, rootDir, Rows } from "./values.js";

const loadFile = (filePath: string) => { return fs.readFileSync(filePath, 'utf-8'); };
const replacePlaceholder = (template: string, data: Record<string, any>) => {
	return template.replace(/{{(\w+)}}/g, (match, key) => {
		if (!data[key]) {
			console.warn(`[WARNING]: No replacement found for placeholder: ${key}`);
		}
		return data[key];
	});
};


export const generateEnv = (answers: Record<EnvKeys, string>) => {
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

  const envPath = path.join(rootDir, '.env');

  fs.writeFileSync(envPath, envContent.join('\n'));

  console.log(chalk.green(`\n✅ .env file created at ${envPath}`));
};

export const generateMongodConf = async (answers: Record<EnvKeys, any>) => {
	const mongodExamplePath = path.resolve(rootDir, './mongod.conf.example');
	if (!fs.existsSync(mongodExamplePath)) {
		throw new Error(`Cannot find a file: ${mongodExamplePath}`);
	}

	const mongodExampleTemplate = loadFile(mongodExamplePath);

	const mainMongodTemplate = replacePlaceholder(mongodExampleTemplate, {
		[Placeholders.DB_PORT]: answers.DB_PORT
	})

	const mainMongodPath = path.join(rootDir, "./mongod.conf");

	fs.writeFileSync(mainMongodPath, mainMongodTemplate, "utf-8");

	console.log(chalk.green(`\n✅ mongod.conf file created at ${mainMongodPath}`));
}