import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: any) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateConstraint
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  async validate(dateTo: number) {
    const datetime = new Date(dateTo);
    return (datetime instanceof Date) ? true : false
  }
}