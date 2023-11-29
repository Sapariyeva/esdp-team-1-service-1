import { IsValidFromDate, IsValidToDate } from '@/dto/validators/qr.validator';
import { Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class QrDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @Expose()
  svg?: string;

  @Expose()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  locks!: string[];

  @Expose()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsValidFromDate({ message: 'Valid from date must be equal or more current time minus 1 minute' })
  valid_from!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsValidToDate('valid_from', { message: 'Valid to date must be at least 1 hour later than valid from' })
  valid_to!: number;
}

export class QrValidateDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  lock!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  hash!: string;
}
