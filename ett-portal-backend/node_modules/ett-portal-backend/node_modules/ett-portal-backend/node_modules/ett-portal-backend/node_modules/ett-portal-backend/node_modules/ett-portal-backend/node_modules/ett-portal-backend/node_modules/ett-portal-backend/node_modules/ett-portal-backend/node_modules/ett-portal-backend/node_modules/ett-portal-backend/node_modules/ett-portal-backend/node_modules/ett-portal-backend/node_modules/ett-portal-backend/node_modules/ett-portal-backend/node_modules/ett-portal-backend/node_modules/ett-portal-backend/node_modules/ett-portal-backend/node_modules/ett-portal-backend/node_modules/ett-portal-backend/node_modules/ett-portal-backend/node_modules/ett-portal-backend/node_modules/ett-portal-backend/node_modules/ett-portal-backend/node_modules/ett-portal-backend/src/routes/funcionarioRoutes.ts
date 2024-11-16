import { Router } from 'express';
import { getFuncionarios } from '../controllers/funcionarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/funcionarios/:codColigada', authMiddleware, getFuncionarios);

export default router;
