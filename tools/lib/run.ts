import { logHeader } from './ui.js';
import { 
	defaultQuestions, 
	customDbQuestions, 
	customJwtSecretsQuestions, 
	customPortsQuestions, 
	customRedisQuestions } from './questions.js';
import { DefaultValues, EnvKeys } from './values.js';
import { generateEnv, generateMongodConf } from './write-files.js';

export async function runSetup(): Promise<void> {
  const answers: Record<string, any> = {};

  logHeader();

  const defaults = await defaultQuestions();
  Object.assign(answers, defaults);

  if (answers.CONFIGURE_CUSTOM_JWTS) {
    const customJwtSecrets = await customJwtSecretsQuestions();
    Object.assign(answers, customJwtSecrets);
  } else {
    Object.assign(answers, {
      JWT_ACCESS_SECRET: DefaultValues.JWTS.ACCESS,
      JWT_REFRESH_SECRET: DefaultValues.JWTS.REFRESH
    });
  }

  if (answers.CONFIGURE_CUSTOM_PORTS) {
    const customPorts = await customPortsQuestions();
    Object.assign(answers, customPorts);
  } else {
    Object.assign(answers, {
      DB_PORT: DefaultValues.PORTS.DB,
      TG_BOT_PORT: DefaultValues.PORTS.BOT,
      SERVER_PORT: DefaultValues.PORTS.SERVER,
      REDIS_PORT: DefaultValues.PORTS.REDIS
    });
  }

  if (answers.CONFIGURE_CUSTOM_DB) {
    const customDbCredentials = await customDbQuestions();
    Object.assign(answers, customDbCredentials);
  } else {
    Object.assign(answers, {
      DB_ROOT_USERNAME: DefaultValues.DATABASE.ADMIN,
      DB_ROOT_PASSWORD: DefaultValues.DATABASE.ADMIN_PASS,
      DB_DATABASE: DefaultValues.DATABASE.NAME,
      DB_USER: DefaultValues.DATABASE.USER,
      DB_PASS: DefaultValues.DATABASE.USER_PASSWORD
    });
  }

  if (answers.CONFIGURE_CUSTOM_REDIS) {
    const customRedisCredentials = await customRedisQuestions();
    Object.assign(answers, customRedisCredentials);
  } else {
    Object.assign(answers, {
      REDIS_HOST: DefaultValues.REDIS.HOST,
      REDIS_PASSWORD: DefaultValues.REDIS.PASS
    });
  }

  generateEnv(answers);
	generateMongodConf(answers)
}
