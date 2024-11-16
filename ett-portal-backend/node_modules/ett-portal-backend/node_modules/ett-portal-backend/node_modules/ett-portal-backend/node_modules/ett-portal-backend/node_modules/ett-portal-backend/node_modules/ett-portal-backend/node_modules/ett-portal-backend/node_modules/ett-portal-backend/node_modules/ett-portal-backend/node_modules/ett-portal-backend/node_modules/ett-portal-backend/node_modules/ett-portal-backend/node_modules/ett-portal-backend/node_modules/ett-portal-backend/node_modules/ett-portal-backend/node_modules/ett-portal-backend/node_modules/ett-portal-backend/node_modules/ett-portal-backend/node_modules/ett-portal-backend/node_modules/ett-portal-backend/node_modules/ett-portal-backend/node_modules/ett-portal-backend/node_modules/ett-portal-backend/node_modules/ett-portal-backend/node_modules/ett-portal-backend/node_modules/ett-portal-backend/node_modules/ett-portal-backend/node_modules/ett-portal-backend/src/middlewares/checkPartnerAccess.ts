// src/middlewares/checkPartnerAccess.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { AppDataSource } from '../data-source';

export const checkPartnerAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const empresaId = req.user?.empresaId;

  // Adiciona um log para verificar o `empresaId` e o status de superusuário
  console.log("Empresa ID:", empresaId);
  console.log("Super usuário:", req.user?.super_usuario);

  // Permitir acesso se o usuário for superusuário
  if (req.user?.super_usuario) {
    return next();
  }

  // Bloquear se `empresaId` estiver indefinido para usuários regulares
  if (!empresaId) {
    res.status(403).json({ message: 'Acesso negado. Empresa não identificada.' });
    return;
  }

  try {
    const result = await AppDataSource.query(
      'SELECT status_acesso FROM controle_acesso_parceiros WHERE coligada_id = ?',
      [empresaId]
    );

    console.log("Resultado da consulta de acesso:", result);

    if (result[0]?.status_acesso) {
      next();
    } else {
      res.status(403).json({ message: 'Acesso desativado para esta empresa parceira.' });
    }
  } catch (error) {
    console.error('Erro ao verificar status de acesso da empresa parceira:', error);
    res.status(500).json({ message: 'Erro ao verificar status de acesso' });
  }
};
