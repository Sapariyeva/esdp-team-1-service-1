import { IQrCode, IWeeklyQrCode, IWeeklyScheduleElement } from '@/interfaces/qr.interface';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'qr_codes' })
@Unique(['uuid'])
export class QrCode implements IQrCode {
  @PrimaryGeneratedColumn()
  _id!: number;

  @Column()
  uuid!: string;

  @Column()
  svg!: string;

  @Column({ type: 'jsonb' })
  locks!: string[];

  @Column()
  phone!: string;

  @Column({ type: 'bigint' })
  valid_from!: number;

  @Column({ type: 'bigint' })
  valid_to!: number;
}

@Entity({ name: 'weekly_qr_codes' })
@Unique(['uuid'])
export class WeeklyQrCode extends QrCode implements IWeeklyQrCode {
  @Column({type:'jsonb'})
  schedule!: IWeeklyScheduleElement[];
}
