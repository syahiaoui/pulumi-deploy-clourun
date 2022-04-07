import { Injectable, Logger } from '@nestjs/common';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';
import * as pulumi from '@pulumi/pulumi';
import {
  ProjectRuntime,
  ProjectRuntimeInfo,
  PulumiFn,
} from '@pulumi/pulumi/automation';
import { Output } from '@pulumi/pulumi';

import { PulumiService } from '../pulumi/pulumi.service';

import { CloudRunTemplate } from './entities/cloudrun.entity';

@Injectable()
export class CloudrunService {
  private readonly logger: Logger;
  constructor(private readonly pulumiService: PulumiService) {
    this.logger = new Logger(CloudrunService.name);
    this.pulumiService = pulumiService;
  }

  public createOrUpdate(template: CloudRunTemplate) {
    return this.pulumiService.deployer(template, this.cloudRunSpec(template));
  }

  public findAll(
    projectName: string,
    runtime: ProjectRuntimeInfo | ProjectRuntime,
  ) {
    return this.pulumiService.getAllStacks(projectName, runtime);
  }

  public findOne(projectId: string, projectName: string, stackName: string) {
    return this.pulumiService.getStack(projectId, projectName, stackName);
  }

  public remove(projectId: string, projectName: string, stackName: string) {
    return this.pulumiService.deleteStack(projectId, projectName, stackName);
  }

  private async enableCloudRunService(
    template: CloudRunTemplate,
  ): Promise<void> {
    const enableCloudRun: gcp.projects.Service = new gcp.projects.Service(
      'EnableCloudRun',
      {
        service: 'run.googleapis.com',
        project: template.gcpProjectId,
      },
    );
    this.logger.debug(`Cloud run service is enabled ${enableCloudRun}`);
  }

  private gcrProvider(): docker.Provider {
    return new docker.Provider('eu.gcr', {
      registryAuth: [{ address: 'eu.gcr.io' }],
    });
  }

  private allowUnauthenticated(
    template: CloudRunTemplate,
    service: Output<string>,
  ): gcp.cloudrun.IamMember {
    return new gcp.cloudrun.IamMember('everyone', {
      service,
      location: template.gcpRegion,
      role: 'roles/run.invoker',
      member: 'allUsers',
    });
  }

  private cloudRunSpec(template: CloudRunTemplate): PulumiFn {
    return async (): Promise<any> => {
      await this.enableCloudRunService(template);
      const dockerImage: pulumi.Output<docker.RemoteImage> =
        await this.pulumiService.getNewestDockerImage(
          template,
          this.gcrProvider(),
        );
      const inputService = new gcp.cloudrun.Service(
        template.resourceName,
        {
          location: template.gcpRegion,
          project: template.gcpProjectId,
          name: template.serviceName,
          template: {
            spec: {
              containers: [
                {
                  image: dockerImage.name,
                  ports: template.ports,
                  resources: template.resources,
                  envs: template.envs,
                },
              ],
              containerConcurrency: template.containerConcurrency,
            },
          },
          traffics: template.traffics,
        },
        { dependsOn: dockerImage },
      );
      if (template.allowUnauthenticated) {
        //Open the service to public unrestricted access
        this.allowUnauthenticated(template, inputService.name);
      }

      return {
        baseUrl: inputService.statuses[0].url,
      };
    };
  }
}
