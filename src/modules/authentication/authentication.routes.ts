import express from 'express';
import AuthenticationController from './authentication.controller';

const router = express.Router();
const controller = new AuthenticationController();

// router
//     .get('/ads', GuestMiddleware.guestValidation(true), AquaController.ads)
//     .post('/save', AquaController.save)
//     .get('/count', GuestMiddleware.guestValidation(true), AquaController.count)
//     .post('/graph', GuestMiddleware.guestValidation(true), AquaController.graph)
//     .get('/article', GuestMiddleware.guestValidation(true), AquaController.article)
//     .get('/articleid', AquaController.article_id)
//     .post('/checklist', auth.MemberCheck, GuestMiddleware.guestValidation(true), AquaController.checklist)

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/refresh', controller.getNewAccessToken);
// .post('/forgot-password', controller.login);
// .post('/reset-password', controller.login);

export default router;
