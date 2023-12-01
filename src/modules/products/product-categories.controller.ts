import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { ProductCategoryService } from './categories/service';
import { APIResponse } from '../../interfaces';
import { logger } from '../../utils/logger';

class ProductCategoriesController {
  private readonly service: ProductCategoryService;

  constructor() {
    this.service = new ProductCategoryService();
  }

  getAll = async (_req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const data = await this.service.getAll();

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.categories.getAll.error', error);
      next(error);
    }
  };
  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');

      const data = await this.service.getOne(+id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.categories.getOne.error', error);
      next(error);
    }
  };
  create = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');
      const data = await this.service.create({ ...body });

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('product.categories.create.error', error);
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
      logger.error('product.categories.update.error', error);
      next(error);
    }
  };
  delete = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');

      const data = await this.service.delete(+id);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.categories.delete.error', error);
      next(error);
    }
  };
}

export default ProductCategoriesController;
