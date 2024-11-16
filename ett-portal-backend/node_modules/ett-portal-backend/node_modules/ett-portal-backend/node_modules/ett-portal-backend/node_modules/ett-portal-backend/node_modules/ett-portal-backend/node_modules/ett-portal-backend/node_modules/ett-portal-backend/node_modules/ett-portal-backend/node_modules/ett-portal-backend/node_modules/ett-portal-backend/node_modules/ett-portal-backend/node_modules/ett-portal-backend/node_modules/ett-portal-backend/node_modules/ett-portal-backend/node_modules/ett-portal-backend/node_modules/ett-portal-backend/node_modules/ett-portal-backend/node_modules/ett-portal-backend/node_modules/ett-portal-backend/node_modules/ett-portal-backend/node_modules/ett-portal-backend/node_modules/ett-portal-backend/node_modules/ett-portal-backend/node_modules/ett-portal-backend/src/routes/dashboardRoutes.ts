// src/routes/dashboardRoutes.ts

import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { checkPartnerAccess } from '../middlewares/checkPartnerAccess';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Adiciona o parâmetro opcional `/:coligadaId?`
router.get('/dashboard/:coligadaId?', authMiddleware, checkPartnerAccess, getDashboardData);

export default router;
