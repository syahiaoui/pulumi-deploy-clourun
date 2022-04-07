export interface CloudRunTemplate {
  pulumiProjectName: string;
  pulumiStackName: string;
  gcpProjectId: string;
  gcpRegion: string;
  imageName: string;
  dockerImage: string;
  resourceName: string;
  serviceName: string;
  containerConcurrency: number;
  ports: {
    containerPort: number;
    name?: string;
    protocol?: string;
  }[];
  resources: {
    limits: {
      memory: string;
    };
  };
  envs: {
    name: string;
    value: string;
  }[];
  traffics: {
    latestRevision: boolean;
    percent: number;
  }[];
}
