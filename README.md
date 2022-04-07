## Description

CRUD using pulumi to deploy into CloudRun

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploiement

Pour faire un deploiment local il faut:
* Installer Pulumi
    ```bash
    curl -fsSL https://get.pulumi.com | sh # https://www.pulumi.com/docs/get-started/install/
    # Dans certain cas il faut aussi installer (à voir sur le net les dernieres versions)
    pulumi plugin install resource docker v3.2.0
    pulumi plugin install resource gcp v6.17.0

    pulumi login gs://ysamir-data-processing-test_pulumi
    ```    
* Configurer gcloud
    ```bash
    gcloud config set project ysamir-data-processing-test # à modifier en fonction de votre projet
    gcloud auth application-default login # ou gcloud auth login
    gcloud auth configure-docker
    ```
    
## FAQ (pulumi)

###  Résoudre le probleme: <b>error: the current deployment has 1 resource(s) with pending operation</b>
```json
{
  "commandResult": {
    "stdout": "Updating (rdo-admin-api-v1):\n \n",
    "stderr": "error: the current deployment has 1 resource(s) with pending operations:\n  * urn:pulumi:rdo-admin-api-v1::rdo-admin-api-v1::gcp:cloudrun/service:Service::core-admin-api, interrupted while creating\n\nThese resources are in an unknown state because the Pulumi CLI was interrupted while\nwaiting for changes to these resources to complete. You should confirm whether or not the\noperations listed completed successfully by checking the state of the appropriate provider.\nFor example, if you are using AWS, you can confirm using the AWS Console.\n\nOnce you have confirmed the status of the interrupted operations, you can repair your stack\nusing 'pulumi stack export' to export your stack to a file. For each operation that succeeded,\nremove that operation from the \"pending_operations\" section of the file. Once this is complete,\nuse 'pulumi stack import' to import the repaired stack.\n\nrefusing to proceed\n",
    "code": 255
  },
  "name": "CommandError"
}
```

```bash

pulumi login <BACKEND> # exemple: pulumi login gs://ysamir-data-processing-test_pulumi
export PULUMI_CONFIG_PASSPHRASE=''
pulumi stack export --file faq/exportedAPI.json # contient la pending_operation
# il faut supprimer la pendinf_operation puis
pulumi stack import --file faq/apiToImport.json #choisir la stack et le pb devrait etre corrigé

```
###  Supprimer une stack en ligne de commande
```bash
pulumi login <BACKEND> # exemple: pulumi login gs://ysamir-data-processing-test_pulumi
export PULUMI_CONFIG_PASSPHRASE=''
pulumi stack rm <STACK_NAME> -f # exemple: pulumi stack rm rdo-test -f
# n'oublier pas de confirmer le nom de la stack
```