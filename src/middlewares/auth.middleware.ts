import _ from 'lodash';
import { RequestWithUser } from '../interfaces';
import { verifyToken } from '../utils/jwt.utils';
import { NextFunction, Response } from 'express';
import {
  AuthTokenMissingException,
  WrongAuthTokenException,
} from '../exceptions/unauthorized.exception';
import { AuthenticationRepository } from '../modules/authentication/authentication.repository';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userRepository: AuthenticationRepository = new AuthenticationRepository();
  const authorization = req.header('Authorization');

  if (!authorization) {
    next(new AuthTokenMissingException());
  }

  try {
    const verify = verifyToken(authorization!);
    const _uuid = verify._uuid;
    const user = await userRepository.getUserByUuid(_uuid);

    if (!_.isEmpty(user)) {
      const { uuid, name, email, phone } = user[0];
      req.user = { uuid, name, email, phone };
      next();
    }
  } catch (error) {
    next(new WrongAuthTokenException());
  }
};
