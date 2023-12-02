import express from 'express';
import InventoryController from './inventories.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = express.Router();
const inventoryController = new InventoryController();

// * inventories
router.get('/', authMiddleware, inventoryController.getAll);
router.get('/:productId', authMiddleware, inventoryController.getOneByProductId);
router.patch('/add/:productId', authMiddleware, inventoryController.addStock);
router.patch('/reduce/:productId', authMiddleware, inventoryController.reduceStock);

export default router;
