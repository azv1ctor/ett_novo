"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissaoDashboard = void 0;
const typeorm_1 = require("typeorm");
const Empresa_1 = require("./Empresa");
let PermissaoDashboard = class PermissaoDashboard {
};
exports.PermissaoDashboard = PermissaoDashboard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PermissaoDashboard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PermissaoDashboard.prototype, "empresa_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PermissaoDashboard.prototype, "tipo_dado_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Empresa_1.Empresa, empresa => empresa.id),
    __metadata("design:type", Empresa_1.Empresa)
], PermissaoDashboard.prototype, "empresa", void 0);
exports.PermissaoDashboard = PermissaoDashboard = __decorate([
    (0, typeorm_1.Entity)('permissoes_dashboard')
], PermissaoDashboard);
