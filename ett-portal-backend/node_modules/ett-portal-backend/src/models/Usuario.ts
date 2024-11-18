import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { GrupoEmpresarial } from './GrupoEmpresarial';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha_hash!: string;

  @Column({ default: false })
  super_usuario!: boolean;

  @Column({ nullable: true, type: 'datetime' })
  sessionExpiration?: Date | null;

  // Relacionamento com Empresa
  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios, { nullable: true })
  @JoinColumn({ name: 'empresaId' })
  empresa?: Empresa;

  // Relacionamento com GrupoEmpresarial
  @ManyToOne(() => GrupoEmpresarial, (grupo) => grupo.usuarios, { nullable: true })
  @JoinColumn({ name: 'grupo_empresarial_id' }) // Garante que o nome da coluna seja mapeado corretamente
  grupo_empresarial?: GrupoEmpresarial;
}
