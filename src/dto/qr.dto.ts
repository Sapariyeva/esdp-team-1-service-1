import { Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsPhoneNumber, IsRFC3339, IsString } from 'class-validator';

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
  @IsRFC3339()
  valid_from!: string;

  @Expose()
  @IsNotEmpty()
  @IsRFC3339()
  valid_to!: string;
}
