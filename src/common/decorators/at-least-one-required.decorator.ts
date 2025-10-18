import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneRequired', async: false })
export class AtLeastOneRequiredConstraint
  implements ValidatorConstraintInterface
{
  validate(_: string, args: ValidationArguments): boolean {
    const object = args.object as Record<string, string>;
    const properties = args.constraints;

    return properties.some((property: string) => {
      const propValue = object[property];
      return propValue !== undefined && propValue !== null && propValue !== '';
    });
  }

  defaultMessage(args: ValidationArguments): string {
    const properties = args.constraints;
    return `At least one of the following fields is required: ${properties.join(', ')}`;
  }
}

export function AtLeastOneRequired(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: properties,
      validator: AtLeastOneRequiredConstraint,
    });
  };
}
