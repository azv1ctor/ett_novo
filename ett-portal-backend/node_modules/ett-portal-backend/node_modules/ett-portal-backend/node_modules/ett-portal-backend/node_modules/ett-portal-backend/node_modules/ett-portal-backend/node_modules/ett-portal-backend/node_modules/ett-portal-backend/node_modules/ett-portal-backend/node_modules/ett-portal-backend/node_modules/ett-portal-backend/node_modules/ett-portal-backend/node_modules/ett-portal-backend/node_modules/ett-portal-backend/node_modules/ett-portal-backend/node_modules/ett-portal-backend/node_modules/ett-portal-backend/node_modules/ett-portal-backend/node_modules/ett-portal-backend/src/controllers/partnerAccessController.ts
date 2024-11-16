// src/controllers/partnerAccessController.ts

import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Parceiro } from '../models/Parceiro';

// Função para listar status de acesso das empresas parceiras de uma coligada específica
export const getPartnerAccessStatus = async (req: Request, res: Response) => {
  try {
    const { coligadaId } = req.params;
    const result = await AppDataSource.query(
      'SELECT * FROM controle_acesso_parceiros WHERE coligada_id = ?',
      [coligadaId]
    );
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar status de acesso das empresas parceiras:', error);
    res.status(500).json({ message: 'Erro ao buscar status de acesso' });
  }
};

// Função para atualizar o status de acesso de uma empresa parceira
export const updatePartnerAccessStatus = async (req: Request, res: Response) => {
  const { partnerId, accessStatus } = req.body;
  try {
    await AppDataSource.query(
      'UPDATE controle_acesso_parceiros SET status_acesso = ? WHERE id = ?',
      [accessStatus, partnerId]
    );
    res.status(200).json({ message: 'Status de acesso atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status de acesso:', error);
    res.status(500).json({ message: 'Erro ao atualizar status de acesso' });
  }
};

export const listarParceiros = async (req: Request, res: Response) => {
  try {
    const parceiros = await AppDataSource.getRepository(Parceiro).find(); // Usando AppDataSource.getRepository
    res.status(200).json(parceiros);
  } catch (error) {
    console.error('Erro ao listar parceiros:', error);
    res.status(500).json({ message: 'Erro ao listar parceiros' });
  }
};
