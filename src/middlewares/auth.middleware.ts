import _ from 'lodash';
import { logger } from '../utils/logger';
import redisUtil from '../utils/redis.util';
import { RequestWithUser } from '../interfaces';
import { verifyToken } from '../utils/jwt.util';
import { NextFunction, Response } from 'express';
import { AppConstant } from '../utils/app-constant';
import {
  AuthTokenMissingException,
  WrongAuthTokenException,
} from '../exceptions/unauthorized.exception';

import { AuthenticationRepository } from '../modules/authentication/authentication.repository';

const authMiddleware = async (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const userRepository: AuthenticationRepository = new AuthenticationRepository();
  const authorization = req.header('Authorization');

  if (!authorization) {
    next(new AuthTokenMissingException());
  }

  const authToken = authorization!.replace('Bearer ', '');

  try {
    const isExist = await redisUtil.isExists(`${AppConstant.REDIS_AUTH_KEY}${authToken}`);

    if (!isExist) {
      next(new WrongAuthTokenException());
    }

    const verify = verifyToken(authToken);
    const _uuid = verify._uuid;
    const user = await userRepository.getUserByUuid(_uuid);

    if (_.isEmpty(user)) {
      next(new WrongAuthTokenException());
    }

    const { uuid, name, email, phone } = user[0];
    req.user = { uuid, name, email, phone };
    next();
  } catch (error) {
    logger.error('authMiddleware.error', error);
    next(new WrongAuthTokenException());
  }
};

export default authMiddleware;
