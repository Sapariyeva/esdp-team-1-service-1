import { appDataSource } from '@/config/dataSource';
import { QrDTO } from '@/dto/qr.dto';
import { QrCode } from '@/entities/qr.entity';
import { IQrCode } from '@/interfaces/qr.interface';

import { Repository } from 'typeorm';

export class QrRepository extends Repository<QrCode> {
  constructor() {
    super(QrCode, appDataSource.createEntityManager());
  }

  async createQr(dto: QrDTO): Promise<IQrCode> {
    const newQr = new QrCode();
    newQr.uuid = dto.id!;
    newQr.svg = dto.svg!;
    newQr.locks = dto.locks;
    newQr.phone = dto.phone;
    newQr.valid_from = dto.valid_from;
    newQr.valid_to = dto.valid_to;
    return await this.save(newQr);
  }

  async getQrByUUID(uuid: string): Promise<IQrCode | null> {
    return this.findOne({where: {uuid}})
  }
}