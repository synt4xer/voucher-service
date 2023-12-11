import _ from 'lodash';
import { logger } from '../../utils/logger';
import { APIResponse } from '../../types/commons';
import { ShipmentService } from './shipments.service';
import { NextFunction, Request, Response } from 'express';

class ShipmentsController {
  private readonly service: ShipmentService;

  constructor() {
    this.service = new ShipmentService();
  }

  getAll = async (_req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const data = await this.service.getAll();

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('shipments.getAll.error', error);
      next(error);
    }
  };
  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');

      const data = await this.service.getOne(code);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('shipments.getOne.error', error);
      next(error);
    }
  };
  create = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');
      const data = await this.service.create({ ...body });

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('shipments.create.error', error);
      next(error);
    }
  };
  update = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');
      const body = _.get(req, 'body');

      const data = await this.service.update({ ...body }, code);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('shipments.update.error', error);
      next(error);
    }
  };
  delete = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');

      await this.service.delete(code);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('shipments.delete.error', error);
      next(error);
    }
  };
}

export default ShipmentsController;
