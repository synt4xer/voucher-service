import _ from 'lodash';
import { logger } from '../../utils/logger';
import { APIResponse } from '../../types/commons';
import { NextFunction, Request, Response } from 'express';
import { ProductCategoryService } from './categories/service';

class ProductCategoriesController {
  private readonly service: ProductCategoryService;

  constructor() {
    this.service = new ProductCategoryService();
  }

  list = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const name: string = _.get(req, 'query.name', null) as string;
      const data = await this.service.list(name);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.categories.list.error', error);
      next(error);
    }
  };

  getAll = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
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

      await this.service.delete(+id);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('product.categories.delete.error', error);
      next(error);
    }
  };
}

export default ProductCategoriesController;
