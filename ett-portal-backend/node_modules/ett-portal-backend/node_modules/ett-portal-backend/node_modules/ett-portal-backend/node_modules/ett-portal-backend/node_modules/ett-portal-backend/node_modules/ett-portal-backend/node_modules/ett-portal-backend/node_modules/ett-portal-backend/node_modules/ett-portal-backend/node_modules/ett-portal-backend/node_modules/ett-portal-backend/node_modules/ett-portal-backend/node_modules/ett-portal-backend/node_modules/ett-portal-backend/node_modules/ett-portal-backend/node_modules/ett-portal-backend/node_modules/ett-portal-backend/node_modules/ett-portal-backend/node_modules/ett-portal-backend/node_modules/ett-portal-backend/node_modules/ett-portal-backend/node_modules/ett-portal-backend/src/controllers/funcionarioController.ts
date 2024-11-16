// src/controllers/funcionarioController.ts
import { Request, Response, NextFunction } from 'express';
import sql from '../config/sqlServerConfig';

export const getFuncionarios = async (req: Request, res: Response, next: NextFunction) => {
  const codColigada = req.params.codColigada;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 50; // define 50 como o padrão
  
  const offset = (page - 1) * pageSize;

  try {
    const result = await sql.query`
      SELECT *
      FROM ZPWPortalCliente
      WHERE CODCOLIGADA = ${codColigada}
      ORDER BY CHAPA
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY;
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ message: 'Erro ao buscar funcionários' });
  }
};
