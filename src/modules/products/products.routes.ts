import express from 'express';
import ProductController from './products.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import ProductCategoriesController from './product-categories.controller';

const router = express.Router();
const productController = new ProductController();
const categoryController = new ProductCategoriesController();

// * product categories
router.get('/categories', authMiddleware, categoryController.getAll);
router.post('/categories', authMiddleware, categoryController.create);
router.get('/categories/:id', authMiddleware, categoryController.getOne);
router.patch('/categories/:id', authMiddleware, categoryController.update);
router.delete('/categories/:id', authMiddleware, categoryController.delete);

// * products
router.get('/', authMiddleware, productController.getAll);
router.post('/', authMiddleware, productController.create);
router.get('/:id', authMiddleware, productController.getOne);
router.patch('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.delete);
router.get('/list', authMiddleware, productController.list);

export default router;
