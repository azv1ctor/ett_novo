import { Router, RequestHandler } from 'express';
import { requestCode, verifyCode, login } from '../controllers/authController';

const router = Router();

router.post('/request-code', requestCode as RequestHandler);
router.post('/verify-code', verifyCode as RequestHandler);
router.post('/login', login as RequestHandler);

export default router;
