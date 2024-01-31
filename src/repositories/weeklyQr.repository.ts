import { appDataSource } from '@/config/dataSource';
import {  WeeklyQrDTO } from '@/dto/qr.dto';
import {  WeeklyQrCode } from '@/entities/qr.entity';
import { IWeeklyQrCode } from '@/interfaces/qr.interface';

import { Repository } from 'typeorm';

export class WeeklyQrRepository extends Repository<WeeklyQrCode> {
  constructor() {
    super(WeeklyQrCode, appDataSource.createEntityManager());
  }

  async createQr(dto: WeeklyQrDTO): Promise<IWeeklyQrCode> {
    const newQr = new WeeklyQrCode();
    if (!dto.id) throw new Error('No weekly QR Id')
    newQr.uuid = dto.id!;
    newQr.svg = dto.svg!;
    newQr.locks = dto.locks;
    newQr.phone = dto.phone;
    newQr.valid_from = dto.valid_from;
    newQr.valid_to = dto.valid_to;
    newQr.schedule = dto.schedule.schedule
    return await this.save(newQr);
  }

  async getQrByUUID(uuid: string): Promise<IWeeklyQrCode | null> {
    return this.findOne({where: {uuid}})
  }
}