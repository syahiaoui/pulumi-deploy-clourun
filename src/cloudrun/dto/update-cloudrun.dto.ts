import { PartialType } from '@nestjs/mapped-types';

import { CreateCloudrunDto } from './create-cloudrun.dto';

export class UpdateCloudrunDto extends PartialType(CreateCloudrunDto) {}
