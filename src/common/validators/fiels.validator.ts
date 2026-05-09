import { Field } from 'src/entities/field.entity';
import { FieldType } from 'src/enums/fieldtype.enum';

export interface IValidatorError {
  field: string;
  message: string;
}

export class FieldValueValidator {
  validate(fields: Field[], data: Record<string, unknown>): IValidatorError[] {
    const errors: IValidatorError[] = [];

    for (const field of fields) {
      const value: unknown = data[String(field.id)];
      const fieldKey = `field_${field.id}`;

      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push({ field: fieldKey, message: `${field.label} is required` });
        continue;
      }

      if (value === undefined || value === null || value === '') continue;

      switch (field.type) {
        case FieldType.TEXT:
          if (typeof value !== 'string') {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be a string`,
            });
          } else if (value.length > 200) {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be at most 200 characters`,
            });
          }
          break;

        case FieldType.NUMBER:
          if (typeof value !== 'number') {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be a number`,
            });
          } else if (value < 0 || value > 100) {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be between 0 and 100`,
            });
          }
          break;

        case FieldType.DATE:
          if (typeof value !== 'string') {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be a string date`,
            });
          } else if (isNaN(Date.parse(value))) {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be a valid date`,
            });
          } else if (new Date(value) < new Date(new Date().toDateString())) {
            errors.push({
              field: fieldKey,
              message: `${field.label} must not be a past date`,
            });
          }
          break;

        case FieldType.COLOR:
          if (
            typeof value !== 'string' ||
            !/^#([0-9A-F]{3}){1,2}$/i.test(value)
          ) {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be a valid hex color`,
            });
          }
          break;

        case FieldType.SELECT: {
          const options = Array.isArray(field.options)
            ? (field.options as string[])
            : [];
          if (options.length === 0) {
            errors.push({
              field: fieldKey,
              message: `${field.label} has invalid options configuration`,
            });
          } else if (typeof value !== 'string' || !options.includes(value)) {
            errors.push({
              field: fieldKey,
              message: `${field.label} must be one of the predefined options`,
            });
          }
          break;
        }
      }
    }

    return errors;
  }
}
