import { Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { IsValidDate } from './validators/qr.validator';
import { IWeeklySchedule, IWeeklyScheduleElement } from '@/interfaces/qr.interface';

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

export class WeeklyScheduleDTO implements IWeeklySchedule{
  @Expose()
  id!: string;


  @IsNotEmpty({ message: 'Name of the schedule should be specified' })
  @IsString({ message: 'Name of the schedule should be of string type' })
  @Expose()
  name!: string;

  @IsNotEmpty({ message: "Id of the authorizing user is required!" })
  @Expose()
  author!: string; 

  @Expose()
  @IsArray({ message: "schedule field must contain an array of day working intervals" })
  schedule!: IWeeklyScheduleElement[];
}

export class WeeklyQrDTO extends QrDTO {

  @Expose()
  @IsNotEmpty({message: "Schedule must be provided"})
  schedule!: WeeklyScheduleDTO

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

