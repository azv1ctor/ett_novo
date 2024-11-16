"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const VerificationCode_1 = require("./models/VerificationCode");
const Empresa_1 = require("./models/Empresa");
const Usuario_1 = require("./models/Usuario");
const PermissaoDashboard_1 = require("./models/PermissaoDashboard");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3308,
    username: 'dtc_saga',
    password: '179856',
    database: 'db_st_ettfirst',
    entities: [VerificationCode_1.VerificationCode, Empresa_1.Empresa, Usuario_1.Usuario, PermissaoDashboard_1.PermissaoDashboard],
    synchronize: true,
});
