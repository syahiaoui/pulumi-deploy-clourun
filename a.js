const pulumi = require('@pulumi/pulumi');
const docker = require("@pulumi/docker");


const gcrDockerProvider = new docker.Provider('eu.gcr', {
  registryAuth: [{ address: 'eu.gcr.io' }],
});
console.log(gcrDockerProvider)
const registryImage = pulumi.output(
  docker.getRegistryImage(
    {
      name: 'eu.gcr.io/ysamir-data-processing-test/nest-pubsub-api:1.0.0',
    },
    { provider: gcrDockerProvider },
  ),
);