// src/models/Parceiro.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ControleAcessoParceiroGrupo } from './ControleAcessoParceiroGrupo';

@Entity('controle_acesso_parceiros')
export class Parceiro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome_parceiro!: string;

  @Column()
  coligada_id!: number;

  @Column({ default: true })
  status_acesso: boolean = true;

  @OneToMany(() => ControleAcessoParceiroGrupo, (associacao) => associacao.parceiro)
  associacoes!: ControleAcessoParceiroGrupo[];
}
