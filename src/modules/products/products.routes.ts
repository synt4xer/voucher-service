import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import ProductCategoriesController from './product-categories.controller';

const router = express.Router();
const categoryController = new ProductCategoriesController();

// * product categories
router.get('/categories', authMiddleware, categoryController.getAll);
router.post('/categories', authMiddleware, categoryController.create);
router.get('/categories/:id', authMiddleware, categoryController.getOne);
router.patch('/categories/:id', authMiddleware, categoryController.update);
router.delete('/categories/:id', authMiddleware, categoryController.delete);

// * products

export default router;
