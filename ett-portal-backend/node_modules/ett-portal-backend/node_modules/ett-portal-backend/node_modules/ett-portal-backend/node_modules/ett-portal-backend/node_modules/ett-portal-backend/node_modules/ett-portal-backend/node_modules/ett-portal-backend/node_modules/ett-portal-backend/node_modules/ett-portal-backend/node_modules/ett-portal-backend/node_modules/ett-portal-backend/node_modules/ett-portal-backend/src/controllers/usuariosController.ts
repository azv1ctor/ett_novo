import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Usuario } from '../models/Usuario';
import { GrupoEmpresarial } from '../models/GrupoEmpresarial';

export const criarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, empresaId, super_usuario } = req.body;

    // Criptografar a senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Criar a instância do usuário
    const usuario = new Usuario();
    usuario.nome = nome;
    usuario.email = email;
    usuario.senha_hash = senha_hash;
    usuario.super_usuario = super_usuario || false;

    // Caso seja SUPER ADMIN
    if (super_usuario) {
      usuario.empresa = { id: 1 } as any; // Define empresaId como 1 para SUPER ADMIN
    } else if (empresaId) {
      // Verifica se o grupo empresarial existe
      console.log('Buscando grupo empresarial com empresaId:', empresaId);
      const grupoEmpresarial = await AppDataSource.getRepository(GrupoEmpresarial).findOne({
        where: { id: empresaId },
      });

      if (!grupoEmpresarial) {
        console.error('Grupo empresarial não encontrado para empresaId:', empresaId);
        res.status(404).json({ message: 'Grupo empresarial não encontrado' });
        return;
      }

      // Relaciona ao grupo empresarial encontrado
      usuario.grupo_empresarial = grupoEmpresarial;
    }

    // Salvar o usuário no banco
    await AppDataSource.getRepository(Usuario).save(usuario);

    // Retorno de sucesso
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await AppDataSource.getRepository(Usuario).find({
        relations: ['grupo_empresarial'], // Carregar relacionamentos, se necessário
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ message: 'Erro ao listar usuários' });
    }
  };

  export const deletarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { id: Number(id) } });
  
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
  
      await usuarioRepository.remove(usuario);
  
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
  };