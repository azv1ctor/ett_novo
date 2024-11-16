import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ type: 'enum', enum: ['principal', 'sub-empresa'] })
  tipo_empresa!: 'principal' | 'sub-empresa';

  @Column({ nullable: true })
  empresa_principal_id?: number;

  @Column({ default: true })
  ativo!: boolean;

  @OneToMany(() => Usuario, usuario => usuario.empresa)
  usuarios!: Usuario[];
}
