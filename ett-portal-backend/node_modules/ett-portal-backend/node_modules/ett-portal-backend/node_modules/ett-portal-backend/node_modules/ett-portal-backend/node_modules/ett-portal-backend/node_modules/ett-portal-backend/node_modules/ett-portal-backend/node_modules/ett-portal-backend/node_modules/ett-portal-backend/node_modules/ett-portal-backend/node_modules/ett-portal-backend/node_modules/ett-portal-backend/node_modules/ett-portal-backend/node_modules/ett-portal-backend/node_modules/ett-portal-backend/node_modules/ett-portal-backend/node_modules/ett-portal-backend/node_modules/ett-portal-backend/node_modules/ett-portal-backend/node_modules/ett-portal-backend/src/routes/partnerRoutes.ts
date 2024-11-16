import { Router } from 'express';
import { getPartnerAccessStatus, updatePartnerAccessStatus, listarParceiros } from '../controllers/partnerAccessController';

const router = Router();

// Rota para listar status de acesso das empresas parceiras
router.get('/partner-access', getPartnerAccessStatus);

// Rota para atualizar o status de acesso de uma empresa parceira
router.post('/partner-access/update', updatePartnerAccessStatus);
router.get('/controle-acesso-parceiros', listarParceiros);

export default router;
