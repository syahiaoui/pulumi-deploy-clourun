import { Module } from '@nestjs/common';

import { CloudrunModule } from './cloudrun/cloudrun.module';
import { PulumiService } from './pulumi/pulumi.service';

@Module({
  imports: [CloudrunModule],
  controllers: [],
  providers: [PulumiService],
})
export class AppModule {}
