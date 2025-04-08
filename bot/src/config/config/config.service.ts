import { injectable } from "inversify";

import { ConfigError } from "#config/config/config.error.js";
import { EnvVariables } from "#config/config/env-variables.js";


export interface IConfigService {
	isDevMode: boolean;

	get(key: string): string;
}

@injectable()
export class ConfigService implements IConfigService{
	readonly isDevMode: boolean;

	constructor() {
		this.isDevMode = this.getMode();
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
