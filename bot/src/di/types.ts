export const TYPES = {
	ConfigService: Symbol.for("ConfigService"),
	Logger: Symbol.for("Logger"),

	Bot: Symbol.for("Bot"),

	RedisConfig: Symbol.for("RedisConfig"),
	RedisStore: Symbol.for("RedisStore"),
	RedisPubSub: Symbol.for("RedisPubSub")
}

export const ACTION_TYPES = {
	CreateTokenAction: Symbol.for("CreateTokenAction"),
	CancelAction: Symbol.for("CancelAction")
}

export const COMMAND_TYPES = {
	StartCommand: Symbol.for("StartCommand"),
	MenuCommand: Symbol.for("MenuCommand"),
	CreateToken: Symbol.for("CreateTokenCommand"),
}