import { registerAs } from '@nestjs/config';
import { DATABASE_CONSTANTS } from '../common/constants';

export default registerAs('dbConfig', () => ({
  uri: process.env.MONGODB_URI,
  db: process.env.MONGODB_DB,
  maxPoolSize: DATABASE_CONSTANTS.DEFAULT_MAX_POOL_SIZE,
  minPoolSize: DATABASE_CONSTANTS.DEFAULT_MIN_POOL_SIZE,
  maxIdleTimeMS: DATABASE_CONSTANTS.DEFAULT_MAX_IDLE_TIME_MS,
  waitQueueTimeoutMS: DATABASE_CONSTANTS.DEFAULT_WAIT_QUEUE_TIMEOUT_MS,
  serverSelectionTimeoutMS:
    DATABASE_CONSTANTS.DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
  socketTimeoutMS: DATABASE_CONSTANTS.DEFAULT_SOCKET_TIMEOUT_MS,
  connectTimeoutMS: DATABASE_CONSTANTS.DEFAULT_CONNECT_TIMEOUT_MS,
}));
