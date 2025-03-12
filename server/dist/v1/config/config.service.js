import { ConfigError } from "../utils/errors/index.js";
import { EnvVariables } from "./env-variables.js";
export class ConfigService {
    static instance;
    isDevMode;
    constructor() {
        const mode = this.get(EnvVariables.NODE_MODE);
        this.isDevMode = mode === 'dev' ? true : false;
    }
    static getInstance() {
        if (!ConfigService.instance) {
            this.instance = new ConfigService();
        }
        return this.instance;
    }
    get(key) {
        const value = process.env[key];
        if (!value) {
            throw new ConfigError(`Key <${key}> is not provided in .env file.`);
        }
        return value;
    }
}
