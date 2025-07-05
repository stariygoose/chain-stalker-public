import axios from "axios";
import { inject, injectable } from "inversify";

import { ConfigService } from "#config/config.service.js";
import { EnvVariables } from "#config/env-variables.js";
import { TYPES } from "#di/types.js";
import {
  CollectionMetadata,
  CollectionStats,
} from "#infrastructure/lib/apis/opensea/requests.interfaces.js";
import { ApiError } from "#infrastructure/errors/index.js";
import { CollectionFloorPrice } from "#infrastructure/lib/apis/opensea/responses.interfaces.js";

@injectable()
export class OpenSeaAPI {
  private readonly _baseUrl: string = `https://api.opensea.io/api/v2`;
  private readonly _token: string;
  private readonly _headers: Record<string, string>;

  constructor(
    @inject(TYPES.ConfigService)
    private readonly _config: ConfigService,
  ) {
    this._token = this._config.get(EnvVariables.OPENSEA_TOKEN);
    this._headers = {
      accept: "application/json",
      "x-api-key": this._token,
    };
  }

  /*
   * By address
   */
  public async getCollection(slug: string): Promise<CollectionMetadata> {
    try {
      const collection = await axios.get<CollectionMetadata>(
        `${this._baseUrl}/collections/${slug}`,
        {
          headers: this._headers,
        },
      );

      return collection.data;
    } catch (error: any) {
      if (error.response.status === 400) {
        throw new ApiError.ExternalApiError(
          `A collection <${slug}> may not be supported by Opensea`,
        );
      }

      throw new ApiError.ExternalApiError();
    }
  }

  public async getFloorPrice(slug: string): Promise<CollectionFloorPrice> {
    try {
      const stats = await axios.get<CollectionStats>(
        `${this._baseUrl}/collections/${slug}/stats`,
        {
          headers: this._headers,
        },
      );

      return {
        floorPrice: stats.data.total.floor_price,
        symbol: stats.data.total.floor_price_symbol,
      };
    } catch (error: any) {
      if (error.response.status === 400) {
        throw new ApiError.ExternalApiError(
          `A collection <${slug}> may not be supported by Opensea`,
        );
      }

      throw new ApiError.ExternalApiError();
    }
  }
}

