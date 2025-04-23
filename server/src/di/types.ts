export const TYPES = {
	Logger: Symbol.for('Logger'),
	ConfigService: Symbol.for('ConfigService'),

	ServerConfig: Symbol.for('ServerConfig'),
	MongoDbConfig: Symbol.for('MongoDbConfig'),

	SubscriptionController: Symbol.for('SubscriptionController'),
	SubscriptionService: Symbol.for('SubscriptionService'),
	SubscriptionRepository: Symbol.for('SubscriptionRepository'),

	StrategyController: Symbol.for('StrategyController'),
	StrategyService: Symbol.for('StrategyService'),

	CollectionController: Symbol.for('CollectionController'),
	CollectionService: Symbol.for('CollectionService'),

	TokenController: Symbol.for('TokenController'),
	TokenService: Symbol.for('TokenService'),

	JwtService: Symbol.for('JwtService'),
	JwtTokenRepository: Symbol.for('JwtTokenRepository'),

	UserRepository: Symbol.for('UserRepository'),
	
	AuthController: Symbol.for('AuthController'),
	AuthService: Symbol.for('AuthService'),

	BinanceEventStream: Symbol.for('BinanceEventStream'),
	OpenseaEventStream: Symbol.for('OpenseaEventStream'),
	WebsocketManager: Symbol.for('WebsocketManager'),

	RedisClient: Symbol.for('RedisClient'),
	RedisCache: Symbol.for('RedisCache'),
	RedisPubSub: Symbol.for('RedisPubSub'),

	OpenSeaAPI: Symbol.for('OpenSeaAPI'),
	BinanceAPI: Symbol.for('BinanceAPI')
}