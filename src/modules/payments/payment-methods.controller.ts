import _ from 'lodash';
import { logger } from '../../utils/logger';
import { APIResponse } from '../../types/commons';
import { PaymentMethodService } from './method/service';
import { NextFunction, Request, Response } from 'express';

class PaymentMethodController {
  private readonly service: PaymentMethodService;

  constructor() {
    this.service = new PaymentMethodService();
  }

  getAll = async (_req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const data = await this.service.getAll();

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('payment.method.getAll.error', error);
      next(error);
    }
  };
  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');

      const data = await this.service.getOne(code);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('payment.method.getOne.error', error);
      next(error);
    }
  };
  create = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');
      const data = await this.service.create({ ...body });

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('payment.method.create.error', error);
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
      logger.error('payment.method.update.error', error);
      next(error);
    }
  };
  delete = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');

      await this.service.delete(code);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('payment.method.delete.error', error);
      next(error);
    }
  };
}

export default PaymentMethodController;
