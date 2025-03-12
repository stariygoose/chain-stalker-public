import { ConfigError } from "../utils/errors/index.js";
import { EnvVariables } from "./env-variables.js";

interface IConfigService {
	isDevMode: boolean;
	get(key: string): string;
}

export class ConfigService implements IConfigService{
	private static instance: ConfigService;
	readonly isDevMode: boolean;

	constructor() {
		const mode = this.get(EnvVariables.NODE_MODE);
		this.isDevMode = mode === 'dev' ? true : false;
	}

	public static getInstance(): ConfigService {
		if (!ConfigService.instance) {
			this.instance = new ConfigService();
		}
		return this.instance;
	}

	public get(key: string): string {
		const value = process.env[key];
		if (!value) {
			throw new ConfigError(`Key <${key}> is not provided in .env file.`);
		}
		return value;
	}
}