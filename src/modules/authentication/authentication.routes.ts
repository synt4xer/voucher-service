import express from 'express';
import AuthenticationController from './authentication.controller';
import { loginValidator, refreshValidator, registerValidator } from './authentication.validator';

const router = express.Router();
const controller = new AuthenticationController();

router.post('/login', loginValidator(), controller.login);
router.post('/logout', controller.logout);
router.post('/register', registerValidator(), controller.register);
router.post('/refresh', refreshValidator(), controller.getNewAccessToken);
// .post('/forgot-password', controller.login);
// .post('/reset-password', controller.login);

export default router;
