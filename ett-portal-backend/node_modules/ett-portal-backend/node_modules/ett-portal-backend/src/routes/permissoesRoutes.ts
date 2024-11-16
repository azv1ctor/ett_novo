import { Router, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AppDataSource } from '../data-source';
import { PermissaoDashboard } from '../models/PermissaoDashboard';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const router = Router();

router.post('/configurar-permissoes', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { empresaId, tiposDados } = req.body;

  if (!req.user?.empresaId) {
    res.status(403).json({ message: 'Acesso negado' });
    return;
  }

  try {
    const permissaoRepository = AppDataSource.getRepository(PermissaoDashboard);

    // Remove permissões antigas
    await permissaoRepository.delete({ empresa_id: empresaId });

    // Adiciona novas permissões
    for (const tipoDadoId of tiposDados) {
      const permissao = new PermissaoDashboard();
      permissao.empresa_id = empresaId;
      permissao.tipo_dado_id = tipoDadoId;
      await permissaoRepository.save(permissao);
    }

    res.status(200).json({ message: 'Permissões configuradas com sucesso' });
  } catch (error) {
    console.error('Erro ao configurar permissões:', error);
    res.status(500).json({ message: 'Erro ao configurar permissões' });
  }
});

export default router;
