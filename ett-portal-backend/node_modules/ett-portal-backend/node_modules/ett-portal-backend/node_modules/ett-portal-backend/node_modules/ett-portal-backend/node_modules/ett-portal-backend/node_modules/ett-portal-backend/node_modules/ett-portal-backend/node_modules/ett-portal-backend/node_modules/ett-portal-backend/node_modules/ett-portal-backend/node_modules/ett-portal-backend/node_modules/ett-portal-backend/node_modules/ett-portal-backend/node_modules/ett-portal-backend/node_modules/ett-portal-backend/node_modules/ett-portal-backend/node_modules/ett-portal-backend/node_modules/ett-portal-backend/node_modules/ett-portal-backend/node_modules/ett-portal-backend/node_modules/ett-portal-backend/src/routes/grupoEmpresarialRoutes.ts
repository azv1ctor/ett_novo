import { Router } from 'express';
import { 
  criarGrupoEmpresarial, 
  listarGruposEmpresariais, 
  associarEmpresasAoGrupo, 
  atualizarStatusGrupo,
  listarEmpresasAssociadas,
  editarGrupoEmpresarial,
  excluirGrupoEmpresarial,
  dessassociarEmpresaDoGrupo,
  atualizarStatusAcessoGrupo
} from '../controllers/grupoEmpresarialController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.delete('/grupo-empresarial/desassociar', asyncHandler(dessassociarEmpresaDoGrupo));
router.post('/grupo-empresarial', asyncHandler(criarGrupoEmpresarial));
router.get('/grupo-empresarial', asyncHandler(listarGruposEmpresariais));
router.post('/grupo-empresarial/associar-multiplos', asyncHandler(associarEmpresasAoGrupo)); 
router.put('/grupo-empresarial/:id/status', asyncHandler(atualizarStatusGrupo));
router.get('/grupo-empresarial/:grupoEmpresarialId/partners', asyncHandler(listarEmpresasAssociadas));
router.put('/grupo-empresarial/:id', asyncHandler(editarGrupoEmpresarial)); // Editar grupo
router.delete('/grupo-empresarial/:id', asyncHandler(excluirGrupoEmpresarial));
router.patch('/grupo-empresarial/:id/status', asyncHandler(atualizarStatusAcessoGrupo));

export default router;
