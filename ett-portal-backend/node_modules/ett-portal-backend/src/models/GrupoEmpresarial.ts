// src/models/GrupoEmpresarial.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ControleAcessoParceiroGrupo } from './ControleAcessoParceiroGrupo';
import { Usuario } from './Usuario';

@Entity('grupo_empresarial')
export class GrupoEmpresarial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome_grupo!: string;

  @Column({ default: true })
  status_acesso!: boolean;

  // Relacionamento com ControleAcessoParceiroGrupo
  @OneToMany(() => ControleAcessoParceiroGrupo, (parceiroGrupo) => parceiroGrupo.grupoEmpresarial)
  parceiros!: ControleAcessoParceiroGrupo[];

  // Relacionamento com Usuario
  @OneToMany(() => Usuario, (usuario) => usuario.grupo_empresarial)
  usuarios!: Usuario[];
}
