import _ from 'lodash';
import { logger } from '../../utils/logger';
import { OrderService } from './orders.service';
import { APIResponse } from '../../types/commons';
import { NextFunction, Request, Response } from 'express';

class OrderController {
  private readonly orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getAll = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {};
  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {};
  session = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const userId = _.get(req, 'user.id');
      const body = _.get(req, 'body');

      const data = await this.orderService.doSession({ ...body, userId });

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('order.session.error', error);
      next(error);
    }
  };
  checkout = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const userId = _.get(req, 'user.id');
      const body = _.get(req, 'body');

      // const data =
      await this.orderService.doCheckout({ ...body, userId });

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('order.checkout.error', error);
      next(error);
    }
  };
}

export default OrderController;
