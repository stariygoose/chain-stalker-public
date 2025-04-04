import * as DtoError from "#infrastructure/errors/mapper-error.js";
import * as DataBaseErrors from "#infrastructure/errors/database-errors/database-errors.js";
import * as NotFoundError from "#infrastructure/errors/infrastructure-errors/not-found.error.js";
import * as UnexpectedError from "#infrastructure/errors/infrastructure-errors/unexpected-error.js"
import * as ApiErrors from "#infrastructure/errors/api-errors/api-errors.js";

export const LayerError = {
	...DtoError,
	...DataBaseErrors,
	...NotFoundError,
	...UnexpectedError,
	...ApiErrors
}