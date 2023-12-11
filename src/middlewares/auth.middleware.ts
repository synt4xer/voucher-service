import _ from 'lodash';
import { logger } from '../utils/logger';
import redisUtil from '../utils/redis.util';
import { verifyToken } from '../utils/jwt.util';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../types/commons';
import { AppConstant } from '../utils/app-constant';
import {
  AuthTokenMissingException,
  WrongAuthTokenException,
} from '../exceptions/unauthorized.exception';

import { AuthenticationRepository } from '../modules/authentication/authentication.repository';

const authMiddleware = async (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const userRepository: AuthenticationRepository = new AuthenticationRepository();
  const authorization = req.header('Authorization');

  try {
    if (!authorization) {
      throw new AuthTokenMissingException();
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

    const { uuid, name, email, phone } = user[0];
    req.user = { uuid, name, email, phone };
    next();
  } catch (error) {
    logger.error('authMiddleware.error', error);
    next(error);
  }
};

export default authMiddleware;
