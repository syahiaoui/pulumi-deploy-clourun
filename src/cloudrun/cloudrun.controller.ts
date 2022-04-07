import {
  Controller,
  Get,
  Body,
  Delete,
  UsePipes,
  Query,
  Patch,
} from '@nestjs/common';
import { ProjectRuntime, ProjectRuntimeInfo } from '@pulumi/pulumi/automation';

import { CloudrunService } from './cloudrun.service';
import { CloudRunTemplate } from './entities/cloudrun.entity';
import { CustomValidationPipe } from './validations/custom.validation.pipe';

@Controller('cloudrun')
export class CloudrunController {
  constructor(private readonly cloudrunService: CloudrunService) {}

  @Patch()
  @UsePipes(new CustomValidationPipe())
  create(@Body() createCloud: CloudRunTemplate) {
    return this.cloudrunService.createOrUpdate(createCloud);
  }

  @Get('/stacks')
  findAll(
    @Query('projectName') projectName: string,
    @Query('runtime') runtime: ProjectRuntimeInfo | ProjectRuntime,
  ) {
    return this.cloudrunService.findAll(projectName, runtime);
  }

  @Get('/stack')
  findOne(
    @Query('projectId') projectId: string,
    @Query('projectName') projectName: string,
    @Query('stackName') stackName: string,
  ) {
    return this.cloudrunService.findOne(projectId, projectName, stackName);
  }

  @Delete('/stack')
  remove(
    @Query('projectId') projectId: string,
    @Query('projectName') projectName: string,
    @Query('stackName') stackName: string,
  ) {
    return this.cloudrunService.remove(projectId, projectName, stackName);
  }
}
