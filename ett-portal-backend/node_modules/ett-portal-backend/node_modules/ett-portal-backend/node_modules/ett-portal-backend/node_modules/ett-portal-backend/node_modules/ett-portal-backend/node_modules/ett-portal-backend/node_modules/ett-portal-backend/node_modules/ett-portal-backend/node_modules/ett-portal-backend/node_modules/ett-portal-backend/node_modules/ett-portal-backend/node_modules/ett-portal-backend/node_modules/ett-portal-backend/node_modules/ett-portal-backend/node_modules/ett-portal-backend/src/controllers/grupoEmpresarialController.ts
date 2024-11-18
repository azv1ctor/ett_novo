import { Request, Response } from 'express';
import { GrupoEmpresarial } from '../models/GrupoEmpresarial';
import { ControleAcessoParceiroGrupo } from '../models/ControleAcessoParceiroGrupo';
import { AppDataSource } from '../data-source';

export const listarEmpresasAssociadas = async (req: Request, res: Response) => {
  try {
    const grupoEmpresarialId = parseInt(req.params.grupoEmpresarialId);

    const empresasAssociadas = await AppDataSource.getRepository(ControleAcessoParceiroGrupo).find({
      where: { grupo_empresarial_id: grupoEmpresarialId },
      relations: ['parceiro'],
    });

    const empresasComNome = empresasAssociadas.map((associacao) => ({
      id: associacao.id,
      nome_parceiro: associacao.parceiro.nome_parceiro,
      status_acesso: associacao.status_acesso,
    }));

    res.status(200).json(empresasComNome);
  } catch (error) {
    console.error('Erro ao listar empresas associadas:', error);
    res.status(500).json({ message: 'Erro ao listar empresas associadas' });
  }
};

export const criarGrupoEmpresarial = async (req: Request, res: Response) => {
  try {
    const { nome_grupo } = req.body;
    const grupo = new GrupoEmpresarial();
    grupo.nome_grupo = nome_grupo;
    grupo.status_acesso = true;

    await AppDataSource.getRepository(GrupoEmpresarial).save(grupo);
    res.status(201).json(grupo);
  } catch (error) {
    console.error('Erro ao criar grupo empresarial:', error);
    res.status(500).json({ message: 'Erro ao criar grupo empresarial' });
  }
};

export const listarGruposEmpresariais = async (req: Request, res: Response) => {
  try {
    const grupos = await AppDataSource.getRepository(GrupoEmpresarial).find();
    res.status(200).json(grupos);
  } catch (error) {
    console.error('Erro ao listar grupos empresariais:', error);
    res.status(500).json({ message: 'Erro ao listar grupos empresariais' });
  }
};

export const associarEmpresasAoGrupo = async (req: Request, res: Response) => {
  try {
    const { grupoEmpresarialId, parceirosIds } = req.body;

    if (!grupoEmpresarialId || !parceirosIds || !Array.isArray(parceirosIds)) {
      return res.status(400).json({ message: 'Parâmetros inválidos' });
    }

    const parceiroRepository = AppDataSource.getRepository(ControleAcessoParceiroGrupo);

    for (const parceiroId of parceirosIds) {
      const associacao = new ControleAcessoParceiroGrupo();
      associacao.grupo_empresarial_id = grupoEmpresarialId;
      associacao.parceiro_id = parceiroId;
      associacao.status_acesso = true;

      await parceiroRepository.save(associacao);
    }

    res.status(200).json({ message: 'Empresas associadas com sucesso' });
  } catch (error) {
    console.error('Erro ao associar empresas ao grupo empresarial:', error);
    res.status(500).json({ message: 'Erro ao associar empresas ao grupo empresarial' });
  }
};


export const atualizarStatusGrupo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status_acesso } = req.body;

    const grupoRepository = AppDataSource.getRepository(GrupoEmpresarial);
    const grupo = await grupoRepository.findOne({ where: { id } });

    if (!grupo) {
      return res.status(404).json({ message: 'Grupo empresarial não encontrado' });
    }

    grupo.status_acesso = status_acesso;
    await grupoRepository.save(grupo);

    // Atualizar status de empresas associadas
    await AppDataSource.getRepository(ControleAcessoParceiroGrupo)
      .createQueryBuilder()
      .update()
      .set({ status_acesso }) // Agora `status_acesso` é um campo conhecido
      .where("grupo_empresarial_id = :id", { id })
      .execute();

    res.status(200).json(grupo);
  } catch (error) {
    console.error('Erro ao atualizar status do grupo:', error);
    res.status(500).json({ message: 'Erro ao atualizar status do grupo' });
  }
};

// src/controllers/grupoEmpresarialController.ts

export const editarGrupoEmpresarial = async (req: Request, res: Response) => {
  try {
    const grupoEmpresarialId = parseInt(req.params.id);
    const { nome_grupo } = req.body;

    const grupoRepository = AppDataSource.getRepository(GrupoEmpresarial);
    const grupo = await grupoRepository.findOne({ where: { id: grupoEmpresarialId } });

    if (!grupo) {
      return res.status(404).json({ message: 'Grupo empresarial não encontrado' });
    }

    grupo.nome_grupo = nome_grupo;
    await grupoRepository.save(grupo);

    res.status(200).json(grupo);
  } catch (error) {
    console.error('Erro ao editar grupo empresarial:', error);
    res.status(500).json({ message: 'Erro ao editar grupo empresarial' });
  }
};

export const excluirGrupoEmpresarial = async (req: Request, res: Response) => {
  try {
    const grupoEmpresarialId = parseInt(req.params.id);

    const grupoRepository = AppDataSource.getRepository(GrupoEmpresarial);
    const grupo = await grupoRepository.findOne({ where: { id: grupoEmpresarialId } });

    if (!grupo) {
      return res.status(404).json({ message: 'Grupo empresarial não encontrado' });
    }

    await grupoRepository.remove(grupo);
    res.status(200).json({ message: 'Grupo empresarial excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir grupo empresarial:', error);
    res.status(500).json({ message: 'Erro ao excluir grupo empresarial' });
  }
};

export const dessassociarEmpresaDoGrupo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Payload recebido para desassociação:', req.query);
    const { id } = req.query; // Receba o ID específico do registro

    if (!id) {
      res.status(400).json({ message: 'O ID do registro é obrigatório para desassociar' });
      return;
    }

    const repository = AppDataSource.getRepository(ControleAcessoParceiroGrupo);
    const associacao = await repository.findOne({
      where: { id: Number(id) }, // Agora busca pelo ID do registro
    });

    if (!associacao) {
      res.status(404).json({ message: 'Associação não encontrada' });
      return;
    }

    await repository.remove(associacao);

    res.status(200).json({ message: 'Parceiro desassociado com sucesso' });
  } catch (error) {
    console.error('Erro ao desassociar parceiro:', error);
    res.status(500).json({ message: 'Erro ao desassociar parceiro' });
  }
};

export const atualizarStatusAcessoGrupo = async (req: Request, res: Response) => {
  try {
    const grupoEmpresarialId = parseInt(req.params.id, 10);
    const { status_acesso } = req.body;

    // Verificação de parâmetros e logs
    console.log("### Atualizando Status de Acesso ###", { grupoEmpresarialId, status_acesso });

    if (isNaN(grupoEmpresarialId) || typeof status_acesso !== 'number') {
      console.error("Parâmetros inválidos:", { grupoEmpresarialId, status_acesso });
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    // Converte status_acesso para boolean
    const statusBoolean = status_acesso === 1;

    // Realiza a atualização
    const result = await AppDataSource.getRepository(GrupoEmpresarial)
      .createQueryBuilder()
      .update(GrupoEmpresarial)
      .set({ status_acesso: statusBoolean })  // Agora passamos o valor como boolean
      .where("id = :id", { id: grupoEmpresarialId })
      .execute();

    console.log("### Resultado da Atualização ###", result);

    if (result.affected === 0) {
      console.warn("Nenhum registro foi atualizado. Verifique o ID do grupo.");
      return res.status(404).json({ message: "Grupo empresarial não encontrado." });
    }

    res.status(200).json({ message: "Status de acesso atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar status de acesso do grupo empresarial:", error);
    res.status(500).json({ message: "Erro ao atualizar status de acesso." });
  }
};

export const listarGruposEmpresariaisParaSelect = async (req: Request, res: Response) => {
  try {
    const grupos = await AppDataSource.getRepository(GrupoEmpresarial).find({
      select: ['id', 'nome_grupo'], // Apenas as informações necessárias
    });
    res.status(200).json(grupos);
  } catch (error) {
    console.error('Erro ao listar grupos empresariais:', error);
    res.status(500).json({ message: 'Erro ao listar grupos empresariais' });
  }
};

export const desassociarParceiro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { grupo_empresarial_id, parceiro_id } = req.body;

    if (!grupo_empresarial_id || !parceiro_id) {
      res.status(400).json({ message: 'IDs do grupo empresarial e do parceiro são obrigatórios' });
      return;
    }

    const repository = AppDataSource.getRepository(ControleAcessoParceiroGrupo);
    const associacao = await repository.findOne({
      where: { grupo_empresarial_id, parceiro_id },
    });

    if (!associacao) {
      res.status(404).json({ message: 'Associação não encontrada' });
      return;
    }

    await repository.remove(associacao);

    res.status(200).json({ message: 'Parceiro desassociado com sucesso' });
  } catch (error) {
    console.error('Erro ao desassociar parceiro:', error);
    res.status(500).json({ message: 'Erro ao desassociar parceiro' });
  }
};