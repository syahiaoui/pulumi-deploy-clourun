import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';

const location = gcp.config.region || 'us-central1';


// Default to using ruby-app since that is the name of the image for the example.
const imageName = 'eu.gcr.io/ysamir-data-processing-test/nest-pubsub-api:1.0.0';

const gcrDockerProvider = new docker.Provider('eu.gcr', {
  registryAuth: [
    {
      address: 'eu.gcr.io',
    },
  ],
});

// Used to get the image from the google cloud registry.  Output is required to make sure that the provider is in sync with this call.
const registryImage = pulumi.output(
  docker.getRegistryImage(
    {
      name: imageName,
    },
    { provider: gcrDockerProvider },
  ),
);
// Using the value from the registryImage to pull the image if it's new, pullTriggers looks for a new sha.
const dockerImage = registryImage.apply(
  (r) =>
    new docker.RemoteImage(
      `${imageName}-docker-image`,
      {
        name: r.name!,
        pullTriggers: [registryImage.sha256Digest!],
        keepLocally: true,
      },
      { provider: gcrDockerProvider },
    ),
);

// String used to force the update using the new image.
const truncatedSha = registryImage.sha256Digest.apply(
  (d) => imageName + '-' + d.substr(8, 20),
);
