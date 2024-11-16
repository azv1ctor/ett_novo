import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Usuario } from '../models/Usuario';

export const criarUsuario = async (req: Request, res: Response): Promise<void> => { // Ajuste aqui para Promise<void>
    try {
        const { nome, email, senha, grupo_empresarial_id } = req.body;

        const senha_hash = await bcrypt.hash(senha, 10);

        const usuario = new Usuario();
        usuario.nome = nome;
        usuario.email = email;
        usuario.senha_hash = senha_hash;
        usuario.grupo_empresarial = grupo_empresarial_id;
        usuario.super_usuario = false;

        await AppDataSource.getRepository(Usuario).save(usuario);

        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
};
