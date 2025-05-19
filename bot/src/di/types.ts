export const TYPES = {
	ConfigService: Symbol.for("ConfigService"),
	Logger: Symbol.for("Logger"),
	HttpService: Symbol.for("HttpService"),
	ApiService: Symbol.for("ApiService"),

	Bot: Symbol.for("Bot"),

	RedisConfig: Symbol.for("RedisConfig"),
	RedisStore: Symbol.for("RedisStore"),
	RedisPubSub: Symbol.for("RedisPubSub")
}

export const ACTION_TYPES = {
	CreateTokenAction: Symbol.for("CreateTokenAction"),
	CreateCollectionAction: Symbol.for("CreateCollectionAction"),
	MyStalksAction: Symbol.for("MyStalksAction"),
	MenuAction: Symbol.for("MenuAction"),
	CancelAction: Symbol.for("CancelAction"),

	DeactivateSubscription: Symbol.for("DeactivateSubscriptionCommand"),
	ChangeStrategyAction: Symbol.for("ChangeStrategyAction"),
	DeleteSubscription: Symbol.for("DeleteSubscription")
}

export const COMMAND_TYPES = {
	StartCommand: Symbol.for("StartCommand"),
	LoginCommand: Symbol.for("LoginCommand"),
	MenuCommand: Symbol.for("MenuCommand"),

	CreateToken: Symbol.for("CreateTokenCommand"),
	CreateColection: Symbol.for("CreateColectionCommand"),

	EditSubscription: Symbol.for("EditSubscriptionCommand"),
}