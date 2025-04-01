import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("companies") // Nome da tabela no banco
export class Company {
  @PrimaryGeneratedColumn()
  id!: number; // ! indica que será inicializado pelo TypeORM

  @Column()
  name!: string;

  @Column({ unique: true })
  cnpj!: string;

  @Column({ unique: true })
  corporateEmail!: string;

  @Column()
  industry!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  @Column()
  street!: string;

  @Column()
  number!: string;

  @Column()
  adminFirstName!: string;

  @Column()
  adminLastName!: string;

  @Column()
  adminPhone!: string;

  @Column()
  companyPhone!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: false })
  hasPurchaseManager!: boolean;

  @Column({ default: "pending" })
  status!: string;
}