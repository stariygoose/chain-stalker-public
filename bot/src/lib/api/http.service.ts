import axios from "axios";
import { injectable, inject } from "inversify";

import { TYPES } from "#di/types.js";
import { EnvVariables, IConfigService, ILogger } from "#config/index.js";
import { ApiError } from "#errors/errors/api.error.js";
import { Jwt, MySession } from "#context/context.interface.js";

@injectable()
export class HttpService {
  public static readonly V1_URL: string = "/api/v1";

  public static readonly LOGIN_URL: string = `${HttpService.V1_URL}/auth/bot-login`;
  public static readonly REFRESH_URL: string = `${HttpService.V1_URL}/auth/refresh`;

  public static readonly CREATE_URL: string = `${HttpService.V1_URL}/subscriptions/create`;
  public static readonly TOKEN_URL: string = `${HttpService.V1_URL}/token`;
  public static readonly COLLECTION_URL: string = `${HttpService.V1_URL}/collection`;

  public static readonly SUBSCRIPTIONS_URL: string = `${HttpService.V1_URL}/subscriptions`;
  public static readonly SUBSCRIPTION_DELETE: string = `${HttpService.SUBSCRIPTIONS_URL}/delete`;
  public static readonly SUBSCRIPTIONS_CHANGE_STATUS_URL: string = `${HttpService.SUBSCRIPTIONS_URL}/change_status`;

  public static readonly STRATEGY_URL: string = `${HttpService.V1_URL}/strategy`;
  public static readonly STRATEGY_EDIT: string = `${HttpService.STRATEGY_URL}/update`;

  private readonly BASE_URL: string;

  constructor(
    @inject(TYPES.ConfigService)
    private readonly _configService: IConfigService,
    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {
    this.BASE_URL = this._configService.get(EnvVariables.SERVER_URL);
  }

  public async get<T>(
    endpoint: string,
    session: MySession,
    retry = true,
  ): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${session.jwt?.accessToken}`,
    };

    try {
      const response = await axios.get<T>(url, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      if (error.response.status === 401 && retry) {
        const tokens = await this.refreshToken(session);
        session.jwt = tokens;

        return await this.get<T>(endpoint, session, false);
      }

      throw error;
    }
  }

  public async post<T>(
    endpoint: string,
    data: unknown,
    session: MySession,
    retry = true,
  ): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${session.jwt?.accessToken}`,
    };

    try {
      const response = await axios.post<T>(url, data, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      if (error.response.status === 401 && retry) {
        const tokens = await this.refreshToken(session);
        session.jwt = tokens;

        return await this.post<T>(endpoint, data, session, false);
      }

      throw error;
    }
  }

  public async put<T>(
    endpoint: string,
    data: unknown,
    session: MySession,
    retry = true,
  ): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${session.jwt?.accessToken}`,
    };

    try {
      const response = await axios.put<T>(url, data, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      if (error.response.status === 401 && retry) {
        const tokens = await this.refreshToken(session);
        session.jwt = tokens;

        return await this.put<T>(endpoint, data, session, false);
      }

      throw error;
    }
  }

  public async delete(
    endpoint: string,
    session: MySession,
    retry: boolean = true,
  ): Promise<void> {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${session.jwt?.accessToken}`,
    };

    try {
      await axios.delete(url, {
        headers: headers,
      });
    } catch (error: any) {
      if (error.response.status === 401 && retry) {
        const tokens = await this.refreshToken(session);
        session.jwt = tokens;

        return await this.delete(endpoint, session, false);
      }

      throw error;
    }
  }

  private async refreshToken(session: MySession): Promise<Jwt> {
    const url = `${this.BASE_URL}${HttpService.REFRESH_URL}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const response = await axios.post<Jwt>(
        url,
        {
          refreshToken: session.jwt?.refreshToken,
        },
        {
          headers,
        },
      );

      return response.data;
    } catch (error: any) {
      if (error.response.status === 400) {
        throw new ApiError(
          error.response.data.error,
          `🫥 Can’t track you... No credentials detected. You probably skipped the login. /login`,
        );
      }
      if (error.response.status === 404) {
        throw new ApiError(
          error.response.data.error,
          `Your session has expired. Please log in again.\n /login`,
        );
      }
      this._logger.error(error.message);
      throw new ApiError(
        error.message,
        `Unexpected error while refreshing token. Please, log in again or try later. /login`,
      );
    }
  }
}

