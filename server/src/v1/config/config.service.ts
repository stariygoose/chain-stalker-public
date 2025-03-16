import { ConfigError } from "../utils/errors/index";
import { EnvVariables } from "./env-variables";

interface IConfigService {
	isDevMode: boolean;
	get(key: string): string;
}

export class ConfigService implements IConfigService{
	private static instance: ConfigService;
	readonly isDevMode: boolean;

	constructor() {
		this.isDevMode = this.getMode();
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

	private getMode(): boolean {
		const mode = this.get(EnvVariables.NODE_MODE);
		return mode === 'dev' ? true : false;
	}
}