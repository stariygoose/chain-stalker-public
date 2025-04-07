import * as DtoError from "#infrastructure/errors/mapper-error.js";
import * as DataBaseErrors from "#infrastructure/errors/database-errors/database-errors.js";
import * as ApiErrors from "#infrastructure/errors/api-errors/api-errors.js";
import * as WebsokcetErrors from "#infrastructure/errors/websockets/index.js";

export const LayerError = {
	...DtoError,
	...DataBaseErrors,
	...ApiErrors,
	...WebsokcetErrors
}