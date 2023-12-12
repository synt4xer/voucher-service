import express from 'express';
import OrderController from './orders.controller';

const router = express.Router();
const controller = new OrderController();

router.post('/session', controller.session);

export default router;
