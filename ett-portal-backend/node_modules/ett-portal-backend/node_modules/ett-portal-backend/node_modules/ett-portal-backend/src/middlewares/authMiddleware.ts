import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { Usuario } from '../models/Usuario';
import { AppDataSource } from '../data-source';

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; empresaId: number; super_usuario: boolean };
    
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { id: decoded.userId } });

    if (!usuario) {
      res.status(401).json({ message: 'Usuário não encontrado' });
      return;
    }

    if (usuario.sessionExpiration && new Date() > new Date(usuario.sessionExpiration)) {
      res.status(401).json({ message: 'Sessão expirada, faça login novamente' });
      return;
    }

    req.user = decoded;
    next();
    return; // Certifique-se de retornar após chamar `next()`
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
