import { Module } from '@nestjs/common';

import { PulumiService } from '../pulumi/pulumi.service';

import { CloudrunService } from './cloudrun.service';
import { CloudrunController } from './cloudrun.controller';

@Module({
  controllers: [CloudrunController],
  providers: [CloudrunService, PulumiService],
})
export class CloudrunModule {}
