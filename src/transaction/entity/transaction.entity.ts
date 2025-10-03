import { TransactionStatus, TransactionType } from 'src/common/type';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({ type: 'numeric', precision: 30, scale: 8 })
  amount: string;

  @Column({ type: 'numeric', precision: 30, scale: 8 })
  amountAfterTax: string;

  @Column({ type: 'numeric'})
  taxApplied: string;

  @Column({ type: 'enum', enum: TransactionType })
  trxType: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
