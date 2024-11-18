import { Router, RequestHandler } from 'express';
import { criarUsuario, listarUsuarios, deletarUsuario } from '../controllers/usuariosController';

const router = Router();

router.post('/usuarios', criarUsuario as RequestHandler); // Define a rota POST para criar usuários
router.get('/usuarios', listarUsuarios); 
router.delete('/usuarios/:id', deletarUsuario);

export default router;
