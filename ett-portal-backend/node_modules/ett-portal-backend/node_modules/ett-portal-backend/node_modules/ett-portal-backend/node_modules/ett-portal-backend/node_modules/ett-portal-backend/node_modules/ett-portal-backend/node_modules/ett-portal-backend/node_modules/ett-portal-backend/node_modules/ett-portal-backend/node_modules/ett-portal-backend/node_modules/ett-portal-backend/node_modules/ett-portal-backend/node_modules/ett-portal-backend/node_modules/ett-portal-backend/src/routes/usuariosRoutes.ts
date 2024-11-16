import { Router, RequestHandler } from 'express';
import { criarUsuario } from '../controllers/usuariosController';

const router = Router();

router.post('/usuarios', criarUsuario as RequestHandler); // Define a rota POST para criar usuários

export default router;
