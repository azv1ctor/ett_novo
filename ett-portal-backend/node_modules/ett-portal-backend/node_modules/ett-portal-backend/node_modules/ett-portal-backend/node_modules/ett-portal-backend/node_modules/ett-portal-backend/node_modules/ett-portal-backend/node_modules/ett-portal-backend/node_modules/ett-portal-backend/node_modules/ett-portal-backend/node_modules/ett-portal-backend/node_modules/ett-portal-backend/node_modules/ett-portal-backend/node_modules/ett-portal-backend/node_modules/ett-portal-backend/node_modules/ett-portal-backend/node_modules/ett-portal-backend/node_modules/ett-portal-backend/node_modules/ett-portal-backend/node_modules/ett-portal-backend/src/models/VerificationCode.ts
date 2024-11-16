import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  code!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
