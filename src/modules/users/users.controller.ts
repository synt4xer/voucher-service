import _ from 'lodash';
import { logger } from '../../utils/logger';
import { UsersService } from './users.service';
import { APIResponse } from '../../types/commons';
import { NextFunction, Request, Response } from 'express';

class UsersController {
  private readonly service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  getAll = async (_req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const data = await this.service.getAll();

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('users.getAll.error', error);
      next(error);
    }
  };

  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');

      const data = await this.service.getOne(+id);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('users.getOne.error', error);
      next(error);
    }
  };

  create = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');
      const data = await this.service.create({ ...body });

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('users.create.error', error);
      next(error);
    }
  };

  update = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');
      const body = _.get(req, 'body');

      const data = await this.service.update({ ...body }, +id);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('users.update.error', error);
      next(error);
    }
  };

  delete = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');

      await this.service.delete(+id);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('users.delete.error', error);
      next(error);
    }
  };
}

export default UsersController;
