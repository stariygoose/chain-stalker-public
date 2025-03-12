import winston, { createLogger, format } from "winston";

export const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
		format.printf(({ level, message, timestamp, stack }) => {
			return `|${timestamp}| [${level}]: ${message}${stack ? `\n${stack}` : ''}`
	}),
	),
	transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.printf(({ level, message, timestamp }) => {
        return `|${timestamp}| [${level}]: ${message}`;
      }))
    }),
    new winston.transports.File({ filename: './_logs/combined.log', format: format.uncolorize() }),
		new winston.transports.File({ filename: './_logs/errors.log', format: format.uncolorize(), level: 'error' }),
		new winston.transports.File({ filename: './_logs/warnings.log', format: format.uncolorize(), level: 'warn' }),
  ]
});