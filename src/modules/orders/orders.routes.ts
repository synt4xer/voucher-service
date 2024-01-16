import express from 'express';
import OrderController from './orders.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import { orderValidation, sessionValidation } from './orders.validator';

const router = express.Router();
const controller = new OrderController();

router.get('/list', authMiddleware, controller.list);
router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getOne);
router.post('/session', authMiddleware, sessionValidation(), controller.session);
router.post('/checkout', authMiddleware, orderValidation(), controller.checkout);

export default router;
