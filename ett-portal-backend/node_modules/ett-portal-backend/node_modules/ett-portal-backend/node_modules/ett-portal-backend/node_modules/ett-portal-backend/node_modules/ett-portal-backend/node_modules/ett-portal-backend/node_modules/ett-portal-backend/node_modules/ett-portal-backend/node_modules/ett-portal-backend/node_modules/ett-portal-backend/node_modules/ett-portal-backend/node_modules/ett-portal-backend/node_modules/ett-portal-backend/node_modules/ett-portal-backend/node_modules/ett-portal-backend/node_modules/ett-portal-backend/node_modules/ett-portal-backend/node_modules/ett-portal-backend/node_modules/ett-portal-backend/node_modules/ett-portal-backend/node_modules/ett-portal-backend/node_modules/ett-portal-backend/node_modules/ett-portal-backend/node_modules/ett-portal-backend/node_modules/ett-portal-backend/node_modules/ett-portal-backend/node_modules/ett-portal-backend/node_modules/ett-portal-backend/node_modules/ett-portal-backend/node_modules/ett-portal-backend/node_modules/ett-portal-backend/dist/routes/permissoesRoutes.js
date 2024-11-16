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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const data_source_1 = require("../data-source");
const PermissaoDashboard_1 = require("../models/PermissaoDashboard");
const router = (0, express_1.Router)();
router.post('/configurar-permissoes', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { empresaId, tiposDados } = req.body;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.empresaId)) {
        res.status(403).json({ message: 'Acesso negado' });
        return;
    }
    try {
        const permissaoRepository = data_source_1.AppDataSource.getRepository(PermissaoDashboard_1.PermissaoDashboard);
        // Remove permissões antigas
        yield permissaoRepository.delete({ empresa_id: empresaId });
        // Adiciona novas permissões
        for (const tipoDadoId of tiposDados) {
            const permissao = new PermissaoDashboard_1.PermissaoDashboard();
            permissao.empresa_id = empresaId;
            permissao.tipo_dado_id = tipoDadoId;
            yield permissaoRepository.save(permissao);
        }
        res.status(200).json({ message: 'Permissões configuradas com sucesso' });
    }
    catch (error) {
        console.error('Erro ao configurar permissões:', error);
        res.status(500).json({ message: 'Erro ao configurar permissões' });
    }
}));
exports.default = router;
