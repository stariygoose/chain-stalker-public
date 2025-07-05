import { inject, injectable } from "inversify";
import winston, { createLogger, format } from "winston";
import "winston-daily-rotate-file";

import { ConfigService } from "#config/config.service.js";
import { TYPES } from "#di/types.js";

export interface ILogger {
  info(message: string): void;
  debug(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

@injectable()
export class Logger implements ILogger {
  private readonly _logger: winston.Logger;

  constructor(
    @inject(TYPES.ConfigService)
    private readonly _config: ConfigService,
  ) {
    this._logger = this.setupLogger();
  }

  public warn(message: string): void {
    this._logger.warn(message);
  }

  public error(message: string): void {
    this._logger.error(message);
  }

  public debug(message: string): void {
    this._logger.debug(message);
  }

  public info(message: string): void {
    this._logger.info(message);
  }

  private setupLogger(): winston.Logger {
    return createLogger({
      level: this.getLoggerLevel(),
      format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        format.printf(({ level, message, timestamp }) => {
          return `|${timestamp}| [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp }) => {
              return `|${timestamp}| [${level}]: ${message}`;
            }),
          ),
        }),
        this.rotate("error", false),
        this.rotate("warn", false),
        this.rotate("info", false),
      ],
    });
  }

  private getLoggerLevel(): "debug" | "info" {
    return this._config.isDevMode ? "debug" : "info";
  }

  private rotate(level: "error" | "warn" | "info", colorize: boolean) {
    const dailyTransport = new winston.transports.DailyRotateFile({
      level: level,
      dirname: "./.logs/",
      format: colorize ? format.colorize() : format.uncolorize(),
      filename: "%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    });

    const emergency = createLogger({
      transports: [new winston.transports.Console({ stderrLevels: ["error"] })],
    });

    dailyTransport.on("error", (err) => {
      emergency.error(`[LOGGER ERROR]: ${err.message}`);
    });

    return dailyTransport;
  }
}
