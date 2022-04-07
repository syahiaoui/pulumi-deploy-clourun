import Ajv, { ErrorObject } from 'ajv';

import { CloudRunTemplate } from '../entities/cloudrun.entity';

const ajv = new Ajv({ allErrors: true });

export interface IValidationResult {
  readonly status: boolean;
  readonly failures?: ErrorObject[] | null;
}

export const schemaValidation = async (
  JSC: object,
  data: object,
): Promise<IValidationResult> => {
  const valid = await ajv.validate<CloudRunTemplate>(JSC, data);

  return { status: valid, failures: ajv.errors };
};
