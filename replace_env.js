const fs = require('fs');
const readline = require('readline');
const path = require('path');

const DEFAULT_TUNNEL_PORT = '80';
const DEFAULT_DB_PORT 		= '29999';
const DEFAULT_TG_BOT_PORT = '30000';
const DEFAULT_SERVER_PORT = '30001';
const DEFAULT_CLIENT_PORT = '30002';
const DEFAULT_REDIS_PORT 	= '6379';
const DEFAULT_PORTS = [
	DEFAULT_TUNNEL_PORT,
	DEFAULT_DB_PORT,
	DEFAULT_TG_BOT_PORT,
	DEFAULT_SERVER_PORT,
	DEFAULT_CLIENT_PORT,
	DEFAULT_REDIS_PORT
]

const DEFAULT_DB_ROOT_USERNAME = 'admin';
const DEFAULT_DB_ROOT_PASSWORD = 'adminadmin';
const DEFAULT_DB_DATABASE			 = 'chainstalker';
const DEFAULT_DB_USER 				 = 'user';
const DEFAULT_DB_PASS					 = 'useruser';

const DEFAULT_REDIS_HOST			= 'redis';
const DEFAULT_REDIS_PASSWORD	= 'redisredis';

const DEFAULT_JWT_ACCESS_SECRET	= 'jwt_access_token';
const DEFAULT_JWT_REFRESH_SECRET	= 'jwt_refresh_token';

const Placeholders = {
	TUNNEL_PORT: 'YOUR_TUNNEL_PORT',
	OPENSEA_TOKEN: 'YOUR_OPENSEA_TOKEN',
	TG_BOT_TOKEN: 'YOUR_TG_BOT_TOKEN',
	NGROK_TOKEN: 'YOUR_NGROK_TOKEN',
	TG_BOT_NAME: 'YOUR_TG_BOT_NAME',
	NGROK_STATIC_DOMAIN: 'YOUR_NGROK_STATIC_DOMAIN',

	DB_PORT: 'YOUR_DB_PORT',
	TG_BOT_PORT: 'YOUR_TG_BOT_PORT',
	SERVER_PORT: 'YOUR_SERVER_PORT',
	CLIENT_PORT: 'YOUR_CLIENT_PORT',
	
	DB_ROOT_USERNAME: 'YOUR_DB_ROOT_USERNAME',
	DB_ROOT_PASSWORD: 'YOUR_DB_ROOT_PASSWORD',
	DB_DATABASE: 'YOUR_DB_DATABASE',
	DB_USER: 'YOUR_DB_USER',
	DB_PASS: 'YOUR_DB_PASS',

	REDIS_HOST: 'YOUR_REDIS_HOST',
	REDIS_PORT: 'YOUR_REDIS_PORT',
	REDIS_PASSWORD: 'YOUR_REDIS_PASSWORD',

	JWT_ACCESS_SECRET: 'YOUR_JWT_ACCESS_SECRET',
	JWT_REFRESH_SECRET: 'YOUR_JWT_REFRESH_SECRET'
}

const loadFile = (filePath) => { return fs.readFileSync(filePath, 'utf-8'); };
const replacePlaceholder = (template, data) => {
	return template.replace(/{{(\w+)}}/g, (match, key) => {
		if (!data[key]) {
			console.warn(`[WARNING]: No replacement found for placeholder: ${key}`);
		}
		return data[key];
	});
};
const RL = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const ask = (question) => new Promise((resolve) => RL.question(question, resolve));


// ----------------- CLIENT SETUP ------------------------------
function replaceClientEnv(tgBotName, domainUrl) {
	const clientEnvExamplePath = path.resolve(__dirname, "./client/.env.example");
	if (!fs.existsSync(clientEnvExamplePath)) {
		console.error(`[ERROR]: Can not find a file: ${clientEnvExamplePath}`);
		process.exit(1);
	}

	const clientEnvExampleTemplate = loadFile(clientEnvExamplePath);
	const clientEnvTemplate = replacePlaceholder(clientEnvExampleTemplate, {
		[Placeholders.TG_BOT_NAME]: tgBotName,
		[Placeholders.NGROK_STATIC_DOMAIN]: domainUrl
	});

	const clientEnvPath = path.join(__dirname, "./client/.env");
	fs.writeFileSync(clientEnvPath, clientEnvTemplate, "utf-8");
	console.log(`[INFO]: Successfully created ${clientEnvPath}`);
}
function replaceNginxConf(domainUrl, port) {
	const clientNginxExamplePath = path.resolve(__dirname, "./client/nginx.conf.example");
	if (!fs.existsSync(clientNginxExamplePath)) {
		console.error(`[ERROR]: Can not find a file: ${clientNginxExamplePath}`);
		process.exit(1);
	}

	const clientNginxExampleTemplate = loadFile(clientNginxExamplePath);
	const clientNginxTemplate = replacePlaceholder(clientNginxExampleTemplate, {
		[Placeholders.CLIENT_PORT]: port,
		[Placeholders.NGROK_STATIC_DOMAIN]: domainUrl
	});

	const clientNginxPath = path.join(__dirname, "./client/nginx.conf");
	fs.writeFileSync(clientNginxPath, clientNginxTemplate, "utf-8");
	console.log(`[INFO]: Successfully created ${clientNginxPath}`);
}
async function replaceClientSection(tgBotName, domainUrl, port) {
	replaceClientEnv(tgBotName, domainUrl);
	replaceNginxConf(domainUrl, port);
}


// ------------------- MAIN SETUP ---------------------------------
function replaceMainEnvFile(data) {
	const mainEnvExamplePath = path.resolve(__dirname, "./.env.example");
	if (!fs.existsSync(mainEnvExamplePath)) {
		console.error(`[ERROR]: Can not find a file: ${mainEnvExamplePath}`);
		process.exit(1);
	}

	const mainEnvExampleTemplate = loadFile(mainEnvExamplePath);
	const mainEnvTemplate = replacePlaceholder(mainEnvExampleTemplate, {
		[Placeholders.OPENSEA_TOKEN]: data.openseaToken,
		[Placeholders.TG_BOT_TOKEN]: data.tgBotToken,
		[Placeholders.NGROK_TOKEN]: data.ngrokToken,
		[Placeholders.TG_BOT_NAME]: data.tgBotName,
		[Placeholders.NGROK_STATIC_DOMAIN]: data.domainUrl,
		[Placeholders.TUNNEL_PORT]: data.tunnelPort,
		[Placeholders.DB_PORT]: data.databasePort,
		[Placeholders.TG_BOT_PORT]: data.botPort,
		[Placeholders.SERVER_PORT]: data.serverPort,
		[Placeholders.CLIENT_PORT]: data.clientPort,
		[Placeholders.DB_ROOT_USERNAME]: data.dbAdminName,
		[Placeholders.DB_ROOT_PASSWORD]: data.dbAdminPass,
		[Placeholders.DB_DATABASE]: data.dbName,
		[Placeholders.DB_USER]: data.dbUserName,
		[Placeholders.DB_PASS]: data.dbUserPass,
		[Placeholders.REDIS_HOST]: data.redisHost,
		[Placeholders.REDIS_PORT]: data.redisPort,
		[Placeholders.REDIS_PASSWORD]: data.redisPass,
		[Placeholders.JWT_ACCESS_SECRET]: data.jwt_access_secret,
		[Placeholders.JWT_REFRESH_SECRET]: data.jwt_refresh_secret,
	});
	const mainEnvPath = path.join(__dirname, "./.env");

	fs.writeFileSync(mainEnvPath, mainEnvTemplate, "utf-8");
	console.log(`[INFO]: Successfully created ${mainEnvPath}`);
}
function replaceMainNginxConf(data) {
	const mainNginxExamplePath = path.resolve(__dirname, './nginx.conf.example');
	if (!fs.existsSync(mainNginxExamplePath)) {
		console.error(`[ERROR]: Can not find a file: ${mainNginxExamplePath}`);
		process.exit(1);
	}

	const mainNginxExampleTemplate = loadFile(mainNginxExamplePath);
	const mainNginxTemplate = replacePlaceholder(mainNginxExampleTemplate, {
		[Placeholders.TUNNEL_PORT]: data.tunnelPort,
		[Placeholders.NGROK_STATIC_DOMAIN]: data.domainUrl,
		[Placeholders.CLIENT_PORT]: data.clientPort,
		[Placeholders.SERVER_PORT]: data.serverPort,
		[Placeholders.TG_BOT_PORT]: data.botPort
	})
	const mainNginxPath = path.join(__dirname, "./nginx.conf");

	fs.writeFileSync(mainNginxPath, mainNginxTemplate, "utf-8");
	console.log(`[INFO]: Successfully created ${mainNginxPath}`);
}
function replaceMainNgrokYml(data) {
	const mainNgrokExamplePath = path.resolve(__dirname, './ngrok.yml.example');
	if (!fs.existsSync(mainNgrokExamplePath)) {
		console.error(`[ERROR]: Can not find a file: ${mainNgrokExamplePath}`);
		process.exit(1);
	}

	const mainNgrokExampleTemplate = loadFile(mainNgrokExamplePath);
	const mainNgrokTemplate = replacePlaceholder(mainNgrokExampleTemplate, {
		[Placeholders.TUNNEL_PORT]: data.tunnelPort,
		[Placeholders.NGROK_STATIC_DOMAIN]: data.domainUrl
	})
	const mainNgrokPath = path.join(__dirname, "./ngrok.yml");

	fs.writeFileSync(mainNgrokPath, mainNgrokTemplate, "utf-8");
	console.log(`[INFO]: Successfully created ${mainNgrokPath}`);
}
function replaceMainMongodConf(data) {
	const mainMongodExamplePath = path.resolve(__dirname, './mongod.conf.example');
	if (!fs.existsSync(mainMongodExamplePath)) {
		console.error(`[ERROR]: Can not find a file: ${mainMongodExamplePath}`);
		process.exit(1);
	}

	const mainMongodExampleTemplate = loadFile(mainMongodExamplePath);
	const mainMongodTemplate = replacePlaceholder(mainMongodExampleTemplate, {
		[Placeholders.DB_PORT]: data.databasePort
	})
	const mainMongodPath = path.join(__dirname, "./mongod.conf");

	fs.writeFileSync(mainMongodPath, mainMongodTemplate, "utf-8");
	console.log(`[INFO]: Successfully created ${mainMongodPath}`);
}
async function replaceMainEnv(data) {
	replaceMainEnvFile(data);
	replaceMainNginxConf(data);
	replaceMainNgrokYml(data);
	replaceMainMongodConf(data);
}


// --------------------------- SCRIPT EXECUTION ----------------------------------
async function main() {
	const portsAsk = await ask(`[OPTIONAL]: Do you want to configurate your own ports? (Recommended to use default values)\n` +
		`Default ports: [${DEFAULT_PORTS.map((port) => {return port})}]\n` + 
		`(Y)es | (N)o ? : `);
	const isPorts = (
			portsAsk === 'yes' || portsAsk === 'Yes' || 
			portsAsk === 'Y' || portsAsk === 'y' ||
			portsAsk === 'YES'
		) ?
		true :
		false;
	const dbConfAsk = await ask(`[OPTIONAL]: Do you want to configurate your own Database Config? (Recommended to configurate for better security)\n` +
		`(Y)es | (N)o ? : `);
	const isDbConf = (
			dbConfAsk === 'yes' || dbConfAsk === 'Yes' || 
			dbConfAsk === 'Y' || dbConfAsk === 'y' ||
			dbConfAsk === `YES`
		) ?
		true :
		false;
	const redisConfAsk = await ask(`[OPTIONAL]: Do you want to configurate your own Redis Config? (Recommended to configurate for better security)\n` +
		`Default port: ${DEFAULT_REDIS_PORT}\n`	+
		`(Y)es | (N)o ? : `);
	const isRedisConf = (
			redisConfAsk === 'yes' || redisConfAsk === 'Yes' || 
			redisConfAsk === 'Y' || redisConfAsk === 'y' ||
			redisConfAsk === `YES`
		) ?
		true :
		false;
	const jwtTokensAsk = await ask(`[OPTIONAL]: Do you want to configurate your own Json Web Tokens(JWT) secret phrases? (Recommended to configurate for better security)\n` +
		`Default values: [ACCESS: ${DEFAULT_JWT_ACCESS_SECRET}, REFRESH: ${DEFAULT_JWT_REFRESH_SECRET}]\n`	+
		`(Y)es | (N)o ? : `);
	const isJwtTokens = (
			jwtTokensAsk === 'yes' || jwtTokensAsk === 'Yes' || 
			jwtTokensAsk === 'Y' || jwtTokensAsk === 'y' ||
			jwtTokensAsk === `YES`
		) ?
		true :
		false;


	const openseaToken = await ask(`[REQUIRED]: Your Opensea Auth Token : `);
	// const ngrokToken = await ask(`[REQUIRED]: Your Ngrok Auth Token : `);
	const tgBotToken = await ask(`[REQUIRED]: Your Telegram Bot Auth Token : `);
	const tgBotName = await ask('[REQUIRED]: Your Telegram Bot Username (without @ prefix) : ');
	// const domainUrl = await ask('[REQUIRED]: Your Ngrok Static Domain (without https:// prefix) : ');

	// const tunnelPort = isPorts ?
	// 			(await ask(`[OPTIONAL]: Your port for tunneling requests (leave blank to use default value: ` + 
	// 				`${DEFAULT_TUNNEL_PORT}) : `) || DEFAULT_TUNNEL_PORT)
	// 			: DEFAULT_TUNNEL_PORT;
	// const clientPort = isPorts ?
	// 			(await ask(`[OPTIONAL]: Your port for the Website (leave blank to use default value: ` + 
	// 				`${DEFAULT_CLIENT_PORT}) : `) || DEFAULT_CLIENT_PORT) 
	// 			: DEFAULT_CLIENT_PORT;
	const serverPort = isPorts ?
				(await ask(`[OPTIONAL]: Your port for the Server (leave blank to use default value: ` +
					`${DEFAULT_SERVER_PORT}) : `) || DEFAULT_SERVER_PORT)
				: DEFAULT_SERVER_PORT;
	const botPort = isPorts ?
				(await ask(`[OPTIONAL]: Your port for the Telegram Bot (leave blank to use default value: ` 
					+ `${DEFAULT_TG_BOT_PORT}) : `) || DEFAULT_TG_BOT_PORT)
				: DEFAULT_TG_BOT_PORT;
	const databasePort = isPorts ?
				(await ask(`[OPTIONAL]: Your port for the Database Server (leave blank to use default value: ` +
					`${DEFAULT_DB_PORT}) : `) || DEFAULT_DB_PORT)
				: DEFAULT_DB_PORT;
	const redisPort = isPorts ?
				(await ask(`[OPTIONAL]: Your port for the Redis Server (leave blank to use default value: ` +
					`${DEFAULT_REDIS_PORT}) : `) || DEFAULT_REDIS_PORT)
				: DEFAULT_REDIS_PORT;

	const dbAdminName = isDbConf ?
				(await ask(`[OPTIONAL]: Your Database Admin Name (leave blank to use default value: ` +
					`${DEFAULT_DB_ROOT_USERNAME}) : `) || DEFAULT_DB_ROOT_USERNAME)
				: DEFAULT_DB_ROOT_USERNAME;
	const dbAdminPass = isDbConf ?
				(await ask(`[OPTIONAL]: Your Database Admin Password (leave blank to use default value: `+
					`${DEFAULT_DB_ROOT_PASSWORD}) : `) || DEFAULT_DB_ROOT_PASSWORD)
				: DEFAULT_DB_ROOT_PASSWORD;
	const dbName = isDbConf ?
				(await ask(`[OPTIONAL]: Your Database Name (leave blank to use default value: ` +
					`${DEFAULT_DB_DATABASE}) : `) || DEFAULT_DB_DATABASE)
				: DEFAULT_DB_DATABASE;
	const dbUserName = isDbConf ?
				(await ask(`[OPTIONAL]: Your Database User Name (leave blank to use default value: ` +
					`${DEFAULT_DB_USER}) : `) || DEFAULT_DB_USER)
				: DEFAULT_DB_USER;
	const dbUserPass = isDbConf ?
				(await ask(`[OPTIONAL]: Your Database User Password (leave blank to use default value: ` +
					`${DEFAULT_DB_PASS}) : `) || DEFAULT_DB_PASS)
				: DEFAULT_DB_PASS;

	const redisHost = isRedisConf ?
				(await ask(`[OPTIONAL]: Your Redis Hostname (leave blank to use default value: ` +
					`${DEFAULT_REDIS_HOST}) : `) || DEFAULT_REDIS_HOST)
				: DEFAULT_REDIS_HOST;
	const redisPass = isRedisConf ?
				(await ask(`[OPTIONAL]: Your Redis Password (leave blank to use default value: ` +
					`${DEFAULT_REDIS_PASSWORD}) : `) || DEFAULT_REDIS_PASSWORD)
				: DEFAULT_REDIS_PASSWORD;

	const jwt_access_secret = isJwtTokens ?
				(await ask(`[OPTIONAL]: Your secret phrase for Access JWT (leave blank to use default value: ` +
					`${DEFAULT_JWT_ACCESS_SECRET}) : `) || DEFAULT_JWT_ACCESS_SECRET)
				: DEFAULT_JWT_ACCESS_SECRET;
	const jwt_refresh_secret = isJwtTokens ?
				(await ask(`[OPTIONAL]: Your secret phrase for Refresh JWT (leave blank to use default value: ` +
					`${DEFAULT_JWT_REFRESH_SECRET}) : `) || DEFAULT_JWT_REFRESH_SECRET)
				: DEFAULT_JWT_REFRESH_SECRET;

	await replaceMainEnv({
		openseaToken,
		ngrokToken,
		tgBotToken,
		tgBotName,
		domainUrl,
		tunnelPort,
		clientPort,
		serverPort,
		botPort,
		databasePort,
		redisPort,
		dbAdminName,
		dbAdminPass,
		dbName,
		dbUserName,
		dbUserPass,
		redisHost,
		redisPass,
		jwt_access_secret,
		jwt_refresh_secret
	});
	await replaceClientSection(
		tgBotName,
		domainUrl,
		clientPort
	);

	RL.close();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});