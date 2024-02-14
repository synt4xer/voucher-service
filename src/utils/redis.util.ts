import Redis from 'ioredis';
import { logger } from './logger';
import { AppConstant } from './app-constant';

class RedisUtil {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: AppConstant.REDIS_HOST,
      port: AppConstant.REDIS_PORT,
      password: AppConstant.REDIS_PASSWORD,
      connectTimeout: 10000, // 10 seconds
      maxRetriesPerRequest: 3, // Number of times to retry a request before emitting an error
    });
    logger.info('Connected to redis!');
  }

  setValue = async (key: string, value: string, ttl?: number) => {
    try {
      if (!ttl) {
        await this.client.set(key, value);
      } else {
        await this.client.set(key, value, 'EX', ttl!);
      }
    } catch (error) {
      logger.error('redisUtil.setValue.error', error);
      throw error;
    }
  };

  getValue = async (key: string) => {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      logger.error('redisUtil.getValue.error', error);
      throw error;
    }
  };

  deleteValue = async (...params: string[]) => {
    try {
      await this.client.del([...params]);
    } catch (error) {
      logger.error('redisUtil.deleteValue.error', error);
      throw error;
    }
  };

  isExists = async (key: string) => {
    try {
      const value = await this.client.exists(key);
      return value;
    } catch (error) {
      logger.error('redisUtil.isExists.error', error);
      throw error;
    }
  };
}

export default new RedisUtil();
