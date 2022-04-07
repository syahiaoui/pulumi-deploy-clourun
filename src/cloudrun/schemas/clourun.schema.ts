export const cloudRunSchema = {
  title: 'template used to deploy to cloudRun with pulumi',
  type: 'object',
  required: [
    'pulumiProjectName',
    'pulumiStackName',
    'gcpProjectId',
    'gcpRegion',
    'imageName',
    'dockerImage',
    'resourceName',
    'serviceName',
    'ports',
    'resources',
    'containerConcurrency',
    'envs',
  ],
  properties: {
    pulumiProjectName: {
      type: 'string',
    },
    pulumiStackName: {
      type: 'string',
    },
    gcpProjectId: {
      type: 'string',
    },
    gcpRegion: {
      type: 'string',
    },
    imageName: {
      type: 'string',
    },
    dockerImage: {
      type: 'string',
    },
    resourceName: {
      type: 'string',
    },
    serviceName: {
      type: 'string',
    },
    containerConcurrency: {
      type: 'number',
    },
    allowUnauthenticated: {
      type: 'boolean',
    },
    ports: {
      type: 'array',
      items: {
        type: 'object',
        required: ['containerPort'],
        additionalProperties: false,
        properties: {
          containerPort: {
            type: 'number',
            description: 'Port number',
          },
          name: {
            type: 'string',
            description: "Volume's name",
          },
          protocol: {
            type: 'string',
            description: 'Protocol used on port. Defaults to TCP.',
          },
        },
      },
    },
    resources: {
      type: 'object',
      required: ['limits'],
      additionalProperties: false,
      properties: {
        limits: {
          type: 'object',
          required: ['memory'],
          properties: {
            memory: {
              type: 'string',
            },
          },
        },
      },
    },
    envs: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'value'],
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            description: "Volume's name",
          },
          value: {
            type: 'string',
            description: 'Variable references $(VAR_NAME) are expanded',
          },
        },
      },
    },
    traffics: {
      type: 'array',
      items: {
        type: 'object',
        required: ['latestRevision', 'percent'],
        additionalProperties: false,
        properties: {
          latestRevision: {
            type: 'boolean',
          },
          percent: {
            type: 'number',
          },
        },
      },
    },
  },
} as const;
