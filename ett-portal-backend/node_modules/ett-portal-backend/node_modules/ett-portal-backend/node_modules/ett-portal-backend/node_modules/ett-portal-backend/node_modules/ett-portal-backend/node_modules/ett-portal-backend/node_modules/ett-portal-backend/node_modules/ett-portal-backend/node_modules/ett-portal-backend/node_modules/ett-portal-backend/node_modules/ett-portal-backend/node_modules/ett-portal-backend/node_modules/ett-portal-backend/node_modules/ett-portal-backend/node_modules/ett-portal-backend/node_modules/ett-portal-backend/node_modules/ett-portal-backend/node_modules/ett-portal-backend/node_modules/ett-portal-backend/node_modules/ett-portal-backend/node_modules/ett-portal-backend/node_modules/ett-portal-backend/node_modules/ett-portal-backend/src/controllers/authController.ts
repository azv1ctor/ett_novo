import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendSms } from '../utils/smsService';
import { VerificationCode } from '../models/VerificationCode';
import { Usuario } from '../models/Usuario';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcryptjs';

// Função para gerar data de expiração (30 dias a partir de agora)
const generateSessionExpiration = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  return expirationDate;
};

export const requestCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Dados recebidos na requisição:", req.body);
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      res.status(400).json({ message: 'Email e telefone são obrigatórios' });
      return;
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ email });

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const codeEntry = new VerificationCode();
    codeEntry.email = email;
    codeEntry.phone = phone;
    codeEntry.code = verificationCode.toString();

    await AppDataSource.manager.save(codeEntry);
    await sendSms(phone, `Seu código de verificação é: ${verificationCode}`);

    res.status(200).json({ message: 'Código de verificação enviado' });
  } catch (error) {
    next(error);
  }
};

export const verifyCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, code, rememberLogin } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: 'Email e código são obrigatórios' });
      return;
    }

    const repository = AppDataSource.getRepository(VerificationCode);
    const verificationEntry = await repository.findOneBy({ email, code });

    if (!verificationEntry) {
      res.status(400).json({ message: 'Código inválido ou expirado' });
      return;
    }

    await repository.delete(verificationEntry.id);

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ email });

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    usuario.sessionExpiration = rememberLogin ? generateSessionExpiration() : null;
    await usuarioRepository.save(usuario);

    const token = jwt.sign(
      {
        userId: usuario.id,
        super_usuario: usuario.super_usuario,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao verificar o código:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, senha } = req.body;

  try {
    const usuario = await AppDataSource.getRepository(Usuario).findOne({
      where: { email },
      relations: ['grupo_empresarial'], // Carregar o grupo empresarial do usuário se necessário
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        grupo_empresarial_id: usuario.grupo_empresarial ? usuario.grupo_empresarial.id : null,
        super_usuario: usuario.super_usuario,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};