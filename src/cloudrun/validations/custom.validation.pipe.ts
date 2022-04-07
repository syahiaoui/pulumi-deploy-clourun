import * as empty from 'is-empty';
import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { cloudRunSchema } from '../schemas/clourun.schema'; //we can make import the schema from schema regitry
import { CloudRunTemplate } from '../entities/cloudrun.entity';

import { schemaValidation, IValidationResult } from './ajv.validation';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: CloudRunTemplate): Promise<CloudRunTemplate> {
    if (
      empty(value) ||
      !(typeof value === 'object' && Object.keys(value).length > 0)
    ) {
      throw new HttpException(
        `Validation failed: Payload must be an object with at least one key`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result: IValidationResult = await schemaValidation(
      cloudRunSchema,
      value,
    );
    if (!empty(result.failures)) {
      throw new HttpException(
        JSON.parse(JSON.stringify(result.failures)),
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
