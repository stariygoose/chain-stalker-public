export class ConfigError extends Error {
    message;
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ConfigError';
        Error.captureStackTrace(this, this.constructor);
    }
}
