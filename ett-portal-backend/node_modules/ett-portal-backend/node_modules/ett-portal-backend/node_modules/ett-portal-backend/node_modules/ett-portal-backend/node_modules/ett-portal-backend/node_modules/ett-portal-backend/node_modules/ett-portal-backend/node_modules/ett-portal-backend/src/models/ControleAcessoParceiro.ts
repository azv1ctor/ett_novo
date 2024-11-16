// src/models/ControleAcessoParceiro.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GrupoEmpresarial } from './GrupoEmpresarial';

@Entity('controle_acesso_parceiros')
export class ControleAcessoParceiro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome_parceiro!: string;

  @Column()
  coligada_id!: number;

  @Column({ default: true })
  status_acesso!: boolean;

  @ManyToOne(() => GrupoEmpresarial, grupoEmpresarial => grupoEmpresarial.parceiros, { nullable: true })
  grupoEmpresarial?: GrupoEmpresarial;
}
