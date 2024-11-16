import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Empresa } from './Empresa';

@Entity('permissoes_dashboard')
export class PermissaoDashboard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  empresa_id!: number;

  @Column()
  tipo_dado_id!: number;

  @ManyToOne(() => Empresa, empresa => empresa.id)
  empresa!: Empresa;
}
