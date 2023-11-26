import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { RegisterService } from './register/service';
import { APIResponse } from '../../interfaces';
import { logger } from '../../utils/logger';

class AuthenticationController {
  private readonly registerService: RegisterService;

  constructor() {
    this.registerService = new RegisterService();
  }

  login = async (req: Request, res: Response) => {
    res.send({
      hostname: req.hostname,
      path: req.path,
      method: req.method,
    });
  };

  register = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');

      await this.registerService.register({ ...body });

      res.status(201).json({ success: true });
    } catch (error) {
      logger.error('authentication.error', error);
      next(error);
    }
  };
}

export default AuthenticationController;
