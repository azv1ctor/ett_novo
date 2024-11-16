"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.requestCode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const smsService_1 = require("../utils/smsService");
const VerificationCode_1 = require("../models/VerificationCode");
const data_source_1 = require("../data-source");
// Simulação de verificação na view externa
const mockUsers = [
    { email: 'dev02@datacampos.com', phone: '22997544552' },
    { email: 'dev01@datacampos.com', phone: '22998147126' },
];
const checkUserInView = (email, phone) => __awaiter(void 0, void 0, void 0, function* () {
    return mockUsers.some(user => user.email === email && user.phone === phone);
});
const requestCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone } = req.body;
        // Validar entrada
        if (!email || !phone) {
            res.status(400).json({ message: 'Email e telefone são obrigatórios' });
            return;
        }
        // Verificar se o email e telefone correspondem aos dados na view externa
        const userExists = yield checkUserInView(email, phone);
        if (!userExists) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        // Gerar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        // Salvar o código no banco de dados com timestamp
        const codeEntry = new VerificationCode_1.VerificationCode();
        codeEntry.email = email;
        codeEntry.phone = phone;
        codeEntry.code = verificationCode.toString();
        yield data_source_1.AppDataSource.manager.save(codeEntry);
        // Enviar código via SMS usando o Comtele
        yield (0, smsService_1.sendSMS)(phone, `Seu código de verificação é: ${verificationCode}`);
        res.status(200).json({ message: 'Código de verificação enviado' });
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de tratamento de erros
    }
});
exports.requestCode = requestCode;
const verifyCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        // Validar entrada
        if (!email || !code) {
            res.status(400).json({ message: 'Email e código são obrigatórios' });
            return;
        }
        // Verificar se o código é válido
        const repository = data_source_1.AppDataSource.getRepository(VerificationCode_1.VerificationCode);
        const verificationEntry = yield repository.findOneBy({ email, code });
        if (!verificationEntry) {
            res.status(400).json({ message: 'Código inválido ou expirado' });
            return;
        }
        // Remover o código após uso
        yield repository.delete(verificationEntry.id);
        // Gerar token JWT
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de tratamento de erros
    }
});
exports.verifyCode = verifyCode;
