import winston, { createLogger, format } from "winston";
export const logger = createLogger({
    level: 'info',
    format: format.combine(format.errors({ stack: true }), format.colorize(), format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), format.printf(({ level, message, timestamp, stack }) => (`|${timestamp}| [${level}]: ${message} ${stack || ''}`))),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './_volume/logs/combined.log', format: format.uncolorize() }),
        new winston.transports.File({ filename: './_volume/logs/errors.log', format: format.uncolorize(), level: 'error' }),
        new winston.transports.File({ filename: './_volume/logs/warnings.log', format: format.uncolorize(), level: 'warn' }),
    ]
});
