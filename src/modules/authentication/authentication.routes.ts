import express from 'express';
import AuthenticationController from './authentication.controller';

const router = express.Router();
const controller = new AuthenticationController();

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/register', controller.register);
router.post('/refresh', controller.getNewAccessToken);
// .post('/forgot-password', controller.login);
// .post('/reset-password', controller.login);

export default router;
