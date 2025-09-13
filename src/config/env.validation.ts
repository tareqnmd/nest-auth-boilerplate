import * as joi from 'joi';

export default joi.object({
  PORT: joi.number().required(),
  NODE_ENV: joi.string().required(),

  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SYNCHRONIZE: joi.boolean().required(),
  DB_AUTO_LOAD_ENTITIES: joi.boolean().required(),

  JWT_TOKEN_SECRET: joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: joi.string().required(),

  GOOGLE_CLIENT_ID: joi.string().required(),
  GOOGLE_CLIENT_SECRET: joi.string().required(),

  GITHUB_CLIENT_ID: joi.string().required(),
  GITHUB_CLIENT_SECRET: joi.string().required(),
});
