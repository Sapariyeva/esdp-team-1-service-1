import { Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { IsValidDate } from './validators/qr.validator';

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
  @IsValidDate({message: "valid_from must be convertable to Date format"})
  valid_to!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsValidDate({message: "valid_from must be convertable to Date format"})
  valid_from!: number;
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

