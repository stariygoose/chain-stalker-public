
export const TYPES = {
	Logger: Symbol.for('Logger'),
	ConfigService: Symbol.for('ConfigService'),

	ServerConfig: Symbol.for('ServerConfig'),
	MongoDbConfig: Symbol.for('MongoDbConfig'),

	SubscriptionController: Symbol.for('SubscriptionController'),
	SubscriptionService: Symbol.for('SubscriptionService'),
	SubscriptionRepository: Symbol.for('SubscriptionRepository'),

	OpenseaEventStream: Symbol.for('OpenseaEventStream'),
	WebsocketManager: Symbol.for('WebsocketManager'),

	RedisClient: Symbol.for('RedisClient'),
	RedisCache: Symbol.for('RedisCache'),
	RedisPubSub: Symbol.for('RedisPubSub'),

	OpenSeaAPI: Symbol.for('OpenSeaAPI')
}