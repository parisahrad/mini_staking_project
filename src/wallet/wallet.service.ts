import { Injectable } from '@nestjs/common';
import { Wallet } from './entity/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NightlyBalance } from './entity/nightly-balance.entity';
import { BATCH_SIZE } from 'src/common/constants';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WalletService {
constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,

    @InjectRepository(NightlyBalance)
    private readonly nightlyRepo: Repository<NightlyBalance>,

    private readonly dataSource: DataSource,
  ) {}

  async findUserWallet(id: any, currency: any): Promise<Wallet> {
    throw new Error('Method not implemented.');
  }

  @Cron('0 59 23 * * *')
  async recordNightlyBalances(): Promise<void> {

    let skip = 0;
    while (true) {
      const wallets = await this.walletRepo.createQueryBuilder('w')
        .leftJoinAndSelect('w.user', 'user')
        .orderBy('w.id')
        .limit(BATCH_SIZE)
        .offset(skip)
        .getMany();

      if (!wallets.length) break;

      const snapshots: NightlyBalance[] = wallets.map((w) => {
        const nb = new NightlyBalance();
        nb.user = w.user as any;
        nb.wallet = w as any;
        nb.balance = w.balance
        return nb;
      });

      await this.dataSource.transaction(async (manager) => {
        await manager.getRepository(NightlyBalance).save(snapshots);
      });

      skip += wallets.length;
    }

  }

}
