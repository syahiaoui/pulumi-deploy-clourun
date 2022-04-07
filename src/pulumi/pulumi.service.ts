/* eslint-disable no-console */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  LocalWorkspace,
  ProjectRuntime,
  ProjectRuntimeInfo,
  PulumiFn,
  Stack,
} from '@pulumi/pulumi/automation';
import { Bucket, Storage } from '@google-cloud/storage';
import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';

import { CloudRunTemplate } from '../cloudrun/entities/cloudrun.entity';

const storage = new Storage();

interface BackendUrl {
  backendUrl: string;
}
@Injectable()
export class PulumiService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(PulumiService.name);
  }

  public initPulumi(projectId: string): Promise<string> {
    return this.initBackendAsGCStorage(projectId).then(this.setPulumiEnv);
  }

  public async deployer(template: CloudRunTemplate, program: PulumiFn) {
    const backendUrl: string = await this.initPulumi(template?.gcpProjectId);
    this.logger.log(`Pulumi configured with backend: ${backendUrl}`);
    const stack: Stack = await this.createOrSelectStack(template, program);
    await stack.setConfig('gcp:region', { value: template.gcpRegion });
    await stack.setConfig('gcp:project', { value: template.gcpProjectId });
    const upRes: pulumi.automation.UpResult = await stack.up({
      onOutput: console.log,
    });
    await stack.refresh({ onOutput: console.log });
    this.logger.log(`Pulumi stack up: ${upRes}`);

    return upRes;
  }

  public getNewestDockerImage(
    template: CloudRunTemplate,
    dockerProvider: docker.Provider,
  ): pulumi.Output<docker.RemoteImage> {
    const registryImage = pulumi.output(
      docker.getRegistryImage(
        { name: template.dockerImage },
        { provider: dockerProvider },
      ),
    );

    // Using the value from the registryImage to pull the image if it's new, pullTriggers looks for a new sha.
    return registryImage.apply(
      (r) =>
        new docker.RemoteImage(
          `${template.imageName}-docker-image`,
          {
            name: r.name,
            pullTriggers: [registryImage.sha256Digest],
            keepLocally: true,
          },
          { provider: dockerProvider },
        ),
    );
  }

  public async getAllStacks(
    projectName: string,
    runtime: ProjectRuntimeInfo | ProjectRuntime,
  ): Promise<pulumi.automation.StackSummary[]> {
    const ws = await LocalWorkspace.create({
      projectSettings: { name: projectName, runtime },
    });

    return ws.listStacks();
  }

  public async getStack(
    projectId: string,
    projectName: string,
    stackName: string,
  ): Promise<pulumi.automation.OutputMap> {
    await this.initPulumi(projectId);
    const stack = await this.selectStack(stackName, projectName);

    return stack.outputs();
  }

  public async deleteStack(
    projectId: string,
    projectName: string,
    stackName: string,
  ): Promise<pulumi.automation.DestroyResult> {
    await this.initPulumi(projectId);
    const stack = await this.selectStack(stackName, projectName);

    return stack.destroy({ onOutput: console.log });
  }

  private selectStack(projectName: string, stackName: string): Promise<Stack> {
    return LocalWorkspace.selectStack({
      stackName,
      projectName,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      program: async () => {},
    });
  }

  private setPulumiEnv = ({ backendUrl }): string => {
    process.env.PULUMI_CONFIG_PASSPHRASE = '';
    process.env.PULUMI_DEBUG_PROMISE_LEAKS = 'true';
    process.env.PULUMI_BACKEND_URL = backendUrl;

    return backendUrl;
  };

  private createOrSelectStack(template, program: PulumiFn): Promise<Stack> {
    return LocalWorkspace.createOrSelectStack({
      projectName: template.pulumiProjectName,
      stackName: template.pulumiStackName,
      program,
    });
  }

  private async initBackendAsGCStorage(projectId: string): Promise<BackendUrl> {
    if (!projectId) {
      throw new BadRequestException('Config : gcpProject is empty');
    }
    const bucketName = `${projectId}_pulumi`;
    const bucket: Bucket = storage.bucket(bucketName);
    const [exists]: [boolean] = await bucket.exists();
    if (!exists) {
      this.logger.log(
        `Pulumi backend storage ${bucketName} doesn't exists : Creating...`,
      );
      await bucket.create({ location: 'EU' });
      this.logger.log(`Pulumi backend storage ${bucketName} : Done.`);
    }

    return { backendUrl: `gs://${bucketName}` };
  }
}
