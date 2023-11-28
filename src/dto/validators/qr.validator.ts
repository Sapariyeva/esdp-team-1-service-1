import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidFromDateConstaint implements ValidatorConstraintInterface {
  async validate(dateFrom: number, args: ValidationArguments) { 
    const datetime = new Date(dateFrom);
    if (datetime instanceof Date) {
      const now = new Date().getTime();
      return dateFrom >= now - 60 * 1000 ? true : false;
    } else {
      return false;
    }
  }
}

export function IsValidFromDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidFromDateConstaint
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsValidToDateConstaint implements ValidatorConstraintInterface {
  async validate(dateTo: number, args: ValidationArguments) {
    const datetime = new Date(dateTo);
    if (datetime instanceof Date) {
      const [dateFrom] = args.constraints;
      const dateFromValue = (args.object as any)[dateFrom] as number;
      return dateTo - dateFromValue > 3600 * 1000 ? true : false;
    } else {
      return false;
    }
  }
}

export function IsValidToDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidToDateConstaint,
    });
  };
}