import express from 'express';
import UsersController from './users.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = express.Router();

const usersController = new UsersController();

router.get('/', authMiddleware, usersController.getAll);
router.post('/', authMiddleware, usersController.create);
router.get('/:id', authMiddleware, usersController.getOne);
router.patch('/:id', authMiddleware, usersController.update);
router.delete('/:id', authMiddleware, usersController.delete);

export default router;
