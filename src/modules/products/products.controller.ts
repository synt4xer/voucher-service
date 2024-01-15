import _ from 'lodash';
import { logger } from '../../utils/logger';
import { APIResponse } from '../../types/commons';
import { ProductService } from './products/service';
import { NextFunction, Request, Response } from 'express';

class ProductController {
  private readonly service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  list = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const name: string = _.get(req, 'query.name', null) as string;
      const data = await this.service.productLists(name);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.list.error', error);
      next(error);
    }
  };
  getAll = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const name: string = _.get(req, 'query.name', '') as string;
      let data;
      if (!name) {
        data = await this.service.getAll();
      } else {
        data = await this.service.searchByName(name);
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.getAll.error', error);
      next(error);
    }
  };
  getOne = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');

      const data = await this.service.getOne(+id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.getOne.error', error);
      next(error);
    }
  };
  create = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const body = _.get(req, 'body');
      const reqFile = _.get(req, 'files');

      const data = await this.service.create({ ...body }, reqFile);

      res.status(201).json({ success: true, data });
    } catch (error) {
      logger.error('product.create.error', error);
      next(error);
    }
  };
  update = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');
      const body = _.get(req, 'body');
      const reqFile = _.get(req, 'files');

      const data = await this.service.update({ ...body }, reqFile, +id);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('product.update.error', error);
      next(error);
    }
  };
  delete = async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    try {
      const id = _.get(req, 'params.id');

      await this.service.delete(+id);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('product.delete.error', error);
      next(error);
    }
  };
}

export default ProductController;
