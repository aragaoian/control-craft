from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_cloud_sdk_core.api_exception import ApiException
from os import getenv

authenticator = IAMAuthenticator(getenv("CLOUDANT_APIKEY"))
client = CloudantV1(authenticator=authenticator)
client.set_service_url(getenv("CLOUDANT_URL"))

db_name = "agent-db"

try:
    client.get_database_information(db=db_name)
    print(f"Banco '{db_name}' já existe")

except ApiException as e:
    if e.code == 404:
        client.put_database(db=db_name)
        print(f"Banco '{db_name}' criado com sucesso")
    else:
        # Erro inesperado
        raise


def insert_bpmn(
    bpmn_file_path: str,
    process_name: str,
    version: str = "1.0",
):
    with open(bpmn_file_path, "r", encoding="utf-8") as f:
        bpmn_xml = f.read()

    document = {
        "type": "bpmn",
        "process_name": process_name,
        "version": version,
        "content": bpmn_xml,
    }

    response = client.post_document(db=db_name, document=document).get_result()

    return response
