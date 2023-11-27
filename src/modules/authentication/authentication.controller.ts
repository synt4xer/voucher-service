import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './authentication.service';
import { APIResponse } from '../../interfaces';
import { logger } from '../../utils/logger';

class AuthenticationController {
  private readonly service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  login = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const email = _.get(req, 'body.email');
      const password = _.get(req, 'body.password');
      const data = await this.service.login(email, password);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('authentication.login.error', error);
      next(error);
    }
  };

  register = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');

      await this.service.register({ ...body });

      res.status(201).json({ success: true });
    } catch (error) {
      logger.error('authentication.register.error', error);
      next(error);
    }
  };

  getNewAccessToken = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const refreshToken = _.get(req, 'body.refreshToken');
      const data = await this.service.generateAccessToken(refreshToken);

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('authentication.getNewAccessToken.error', error);
      next(error);
    }
  };
}

export default AuthenticationController;
