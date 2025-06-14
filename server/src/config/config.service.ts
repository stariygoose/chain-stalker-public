import { injectable } from "inversify";

import { ConfigError } from "#utils/errors/index.js";
import { EnvVariables } from "#config/env-variables.js";

interface IConfigService {
  isDevMode: boolean;
  get(key: string): string;
}

type Marketplace = string;
type ApiKey = string;

@injectable()
export class ConfigService implements IConfigService {
  private static instance: ConfigService;
  public readonly marketplaces: Record<Marketplace, ApiKey | null>;

  readonly isDevMode: boolean;
  private readonly marketplacesRegex = /^MARKETPLACE_KEY_/;

  constructor() {
    this.isDevMode = this.getMode();
    this.marketplaces = this.getMarketplaces();
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
    return mode === "dev" ? true : false;
  }

  private getMarketplaces(): Record<Marketplace, ApiKey | null> {
    const obj: Record<Marketplace, ApiKey | null> = {};

    Object.keys(process.env)
      .filter((key) => this.marketplacesRegex.test(key))
      .reduce((acc, key) => {
        const marketplace = key.replace(this.marketplacesRegex, "");
        acc[marketplace] = process.env[key] ?? null;
        return acc;
      }, obj);

    return obj;
  }
}
