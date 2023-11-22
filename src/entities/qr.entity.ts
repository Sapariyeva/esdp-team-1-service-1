import { IQrCode } from '@/interfaces/qr.interface';
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

  @Column()
  valid_from!: number;

  @Column()
  valid_to!: number;
}
