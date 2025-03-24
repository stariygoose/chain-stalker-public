import * as DtoError from "#infrastructure/errors/mapper-error.js";
import * as DataBaseErrors from "#infrastructure/errors/database-errors/database-errors.js"

export const LayerError = {
	...DtoError,
	...DataBaseErrors
}