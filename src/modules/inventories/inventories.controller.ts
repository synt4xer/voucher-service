import _ from 'lodash';
import { logger } from '../../utils/logger';
import { APIResponse } from '../../interfaces';
import { InventoryService } from './inventories/service';
import { NextFunction, Request, Response } from 'express';

class InventoryController {
  private readonly service: InventoryService;

  constructor() {
    this.service = new InventoryService();
  }

  getAll = async (_req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const data = await this.service.getAll();

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('inventory.getAll.error', error);
      next(error);
    }
  };
  getOneByProductId = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const productId = _.get(req, 'params.productId');

      const data = await this.service.getOneByProductId(+productId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('inventory.getOneByProductId.error', error);
      next(error);
    }
  };
  addStock = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
        const productId = _.get(req, 'params.productId');
        const body = _.get(req, 'body');
        
        const data = await this.service.updateStock({ operations: 'plus', ...body }, +productId);
        res.status(200).json({ success: true, data });
        
    } catch (error) {
      logger.error('inventory.addStock.error', error);
      next(error);
    }
  };
  reduceStock = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
        const productId = _.get(req, 'params.productId');
        const body = _.get(req, 'body');
        
        const data = await this.service.updateStock({ operations: 'min', ...body }, +productId);
        res.status(200).json({ success: true, data });
        
    } catch (error) {
      logger.error('inventory.reduceStock.error', error);
      next(error);
    }
  };
}

export default InventoryController;
