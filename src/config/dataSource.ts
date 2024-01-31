import { DataSource } from 'typeorm';
import { params } from './enviroment';
import { QrCode, WeeklyQrCode } from '@/entities/qr.entity';

export const appDataSource = new DataSource({
  type: 'postgres',
  url: params.dbUri,
  synchronize: true,
  logging: false,
  entities: [QrCode, WeeklyQrCode],
});
