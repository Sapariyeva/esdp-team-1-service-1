import { Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class QrDTO {
  @Expose()
  uuid?: string;

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
  valid_from!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
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
