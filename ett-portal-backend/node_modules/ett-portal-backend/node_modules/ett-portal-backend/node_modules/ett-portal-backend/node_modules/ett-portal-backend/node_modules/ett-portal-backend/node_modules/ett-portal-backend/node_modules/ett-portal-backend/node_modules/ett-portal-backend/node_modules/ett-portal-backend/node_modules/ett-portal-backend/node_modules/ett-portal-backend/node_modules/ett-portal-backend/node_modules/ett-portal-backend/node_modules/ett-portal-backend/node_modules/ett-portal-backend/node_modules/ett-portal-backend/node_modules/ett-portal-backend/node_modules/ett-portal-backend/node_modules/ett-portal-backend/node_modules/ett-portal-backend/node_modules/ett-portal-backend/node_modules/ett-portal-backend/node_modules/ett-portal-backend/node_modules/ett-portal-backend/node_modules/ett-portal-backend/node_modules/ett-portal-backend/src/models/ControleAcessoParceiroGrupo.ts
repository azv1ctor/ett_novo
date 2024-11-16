import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GrupoEmpresarial } from './GrupoEmpresarial';
import { Parceiro } from './Parceiro';

@Entity('controle_acesso_parceiro_grupo')
export class ControleAcessoParceiroGrupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  grupo_empresarial_id!: number;

  @Column()
  parceiro_id!: number;

  @Column({ default: true })
  status_acesso!: boolean;

  @ManyToOne(() => GrupoEmpresarial, (grupoEmpresarial) => grupoEmpresarial.parceiros)
  @JoinColumn({ name: 'grupo_empresarial_id' })
  grupoEmpresarial!: GrupoEmpresarial;

  @ManyToOne(() => Parceiro)
  @JoinColumn({ name: 'parceiro_id' })
  parceiro!: Parceiro;
}
