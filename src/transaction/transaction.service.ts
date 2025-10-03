import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus, TransactionType } from 'src/common/type';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly walletService: WalletService,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async withdraw(user, amount, currency) {
    const wallet = await this.walletService.findUserWallet(user.id, currency);

    if (!wallet) {
      throw new Error('nosuch wallet');
    }

    if (amount > wallet.balance) {
      throw new Error('balance not enough');
    }

    const trx = await this.transactionRepo.create({
      user: {id: user.id},
      wallet: {id: wallet.id},
      amount,
      trxType: TransactionType.WITHDRAW,
      status: TransactionStatus.PENDING,
    });

    return trx;
  }

  async deposit(user: User, amount: string, currency: string) {
    const wallet = await this.walletService.findUserWallet(user.id, currency);

    if (!wallet) {
      throw new Error('nosuch wallet');
    }

    const trx = await this.transactionRepo.create({
      user: {id: user.id},
      wallet: {id: wallet.id},
      amount,
      trxType: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
    });

    return trx;
  }

  async adminSetStatusOnTransaction(
    user: User,
    trxId: string,
    status: TransactionStatus,
  ) {
    const trx = await this.transactionRepo.findBy({ id: trxId });

    if (!trx) {
      throw new Error('invalid trx id');
    }

    if (status == TransactionStatus.APPROVED) {
      const {amountAfterTax, taxApplied} = await this.calculateTax(trxId);

      await this.transactionRepo.manager.transaction(async (em) => {
        const trxEntity = await em.findOne(Transaction, {
          where: { id: trxId },
          relations: ['wallet', 'user'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!trxEntity) throw new Error('tansaction not found');

        const wallet = await em.findOne(Wallet, {
          where: { id: trxEntity.wallet.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!wallet) throw new Error('wallet not found');

        if (trxEntity.trxType === TransactionType.WITHDRAW) {
          wallet.balance = (
            Number(wallet.balance) - Number(amountAfterTax)
          ).toString();
        } else if (trxEntity.trxType === TransactionType.DEPOSIT) {
          wallet.balance = (
            Number(wallet.balance) + Number(amountAfterTax)
          ).toString();
        }

        await em.save(Wallet, wallet);

        trxEntity.status = TransactionStatus.APPROVED;
        (trxEntity as any).netAmount = amountAfterTax;
        (trxEntity as any).taxApplied = taxApplied;
        (trxEntity as any).admin = user.id;

        await em.save(Transaction, trxEntity);
      });
    } else {
      await this.transactionRepo.update({ id: trxId }, { status: TransactionStatus.REJECTED, admin: {id: user.id} });
    }
  }

  async calculateTax(trxId: string) : Promise<{amountAfterTax: string, taxApplied: string}> {
    throw new Error('Method not implemented.');
  }
}
