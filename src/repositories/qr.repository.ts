import { appDataSource } from '@/config/dataSource';
import { QrCode } from '@/entities/qr.entity';

import { Repository } from 'typeorm';

export class QrRepository extends Repository<QrCode> {
  constructor() {
    super(QrCode, appDataSource.createEntityManager());
  }

  //methods will be here
}