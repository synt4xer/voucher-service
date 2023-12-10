import _ from 'lodash';
import { logger } from '../../utils/logger';
import { APIResponse } from '../../interfaces';
import { VoucherService } from './vouchers.service';
import { NextFunction, Request, Response } from 'express';

class VoucherController {
  private readonly service: VoucherService;

  constructor() {
    this.service = new VoucherService();
  }

  getAll = async (_req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const data = await this.service.getAll();

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('voucher.getAll.error', error);
      next(error);
    }
  };
  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');
      const data = await this.service.getOne(code);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('voucher.getOne.error', error);
      next(error);
    }
  };
  create = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');

      const data = await this.service.create(body);

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('voucher.create.error', error);
      next(error);
    }
  };
  update = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');
      const body = _.get(req, 'body');

      const data = await this.service.update(body, code);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('voucher.update.error', error);
      next(error);
    }
  };
  delete = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const code = _.get(req, 'params.code');
      await this.service.delete(code);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('voucher.delete.error', error);
      next(error);
    }
  };
}

export default VoucherController;
