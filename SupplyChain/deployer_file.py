from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode
from azure.storage.blob import BlockBlobService
import json


class Deployer(object):
    def __init__(self, resource_group, subscription_id, azure_client_id, azure_client_secret, azure_tenant_id, container_name):
        self.subscription_id = subscription_id
        self.resource_group = resource_group
        self.container_name = container_name
        self.credentials = ServicePrincipalCredentials(
            client_id=azure_client_id,
            secret=azure_client_secret,
            tenant=azure_tenant_id
        )
        self.client = ResourceManagementClient(self.credentials, self.subscription_id)

    def deploy(self, arm, parms, connectstring):
        try:
            self.client.resource_groups.create_or_update(
                self.resource_group,
                {
                    'location': 'centralus'
                }
            )
            arm.replace('\\', '/')
            arm_file = arm.split('/')
            parms.replace('\\', '/')
            parms_file = parms.split('/')
            try:
                block_blob_service = BlockBlobService(connection_string=connectstring)
                template = block_blob_service.get_blob_to_text(container_name=self.container_name, blob_name=arm_file[1],
                                                            encoding="utf-8-sig")
                template = json.loads(template.content)
                block_blob_service = BlockBlobService(connection_string=connectstring)
                parameters = block_blob_service.get_blob_to_text(container_name=self.container_name, blob_name=parms_file[1],
                                                                encoding="utf-8-sig")
                parameters = json.loads(parameters.content)
                parameters = parameters["parameters"]
                deployment_properties = {
                    'mode': DeploymentMode.incremental,
                    'template': template,
                    'parameters': parameters
                }
            except Exception as e:
                print("Exception in initializing the deploy variables: ", e)
            try:
                deployment_async_operation = self.client.deployments.create_or_update(self.resource_group, 'azure-sample', deployment_properties)
                deployment_async_operation.wait()
                print("deployment done...................")
            except Exception as e:
                print("Exception in deployment_async_operation: ", e)
        except Exception as e:
            print("Exception in Deployer function: ", e)

        return "success!"