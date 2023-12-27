import _ from 'lodash';
import { logger } from '../utils/logger';
import redisUtil from '../utils/redis.util';
import { verifyToken } from '../utils/jwt.util';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../types/commons';
import { AppConstant } from '../utils/app-constant';
import {
  ApiKeyMissingException,
  AuthTokenMissingException,
  WrongApiKeyException,
  WrongAuthTokenException,
} from '../exceptions/unauthorized.exception';

import { AuthenticationRepository } from '../modules/authentication/authentication.repository';

const authMiddleware = async (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const userRepository: AuthenticationRepository = new AuthenticationRepository();
  const authorization = req.header('Authorization');
  const apiKey = req.header('x-api-key');

  try {
    if (!apiKey) {
      throw new ApiKeyMissingException();
    }

    if (!authorization) {
      throw new AuthTokenMissingException();
    }

    const isAdmin = apiKey === AppConstant.WEB_API_KEY;
    const isMember = apiKey === AppConstant.MOBILE_API_KEY;

    if (!isAdmin && !isMember) {
      throw new WrongApiKeyException();
    }

    const authToken = authorization!.replace('Bearer ', '');

    const isExist = await redisUtil.isExists(`${AppConstant.REDIS_AUTH_KEY}${authToken}`);

    if (!isExist) {
      throw new WrongAuthTokenException();
    }

    const verify = verifyToken(authToken);
    const _uuid = verify._uuid;
    const user = await userRepository.getUserByUuid(_uuid);

    if (_.isEmpty(user)) {
      throw new WrongAuthTokenException();
    }

    const { id, uuid, name, email, phone, role } = user[0];
    req.user = { id, uuid, name, email, phone, role: role! };
    next();
  } catch (error) {
    logger.error('authMiddleware.error', error);
    next(error);
  }
};

export default authMiddleware;
