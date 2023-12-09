import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import ShipmentsController from './shipments.controller';

const router = express.Router();

const shipmentsController = new ShipmentsController();

// * payment method
router.get('/', authMiddleware, shipmentsController.getAll);
router.post('/', authMiddleware, shipmentsController.create);
router.get('/:code', authMiddleware, shipmentsController.getOne);
router.patch('/:code', authMiddleware, shipmentsController.update);
router.delete('/:code', authMiddleware, shipmentsController.delete);

export default router;
