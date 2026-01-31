from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from os import getenv
import requests

authenticator = IAMAuthenticator(getenv("IAM_API_TOKEN"))


def completions(agent_id: str, text: str):
    json_body = {
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "response_type": "text", "text": text}],
            }
        ],
        "stream": False,
    }
    response = requests.post(
        f"https://api.jp-tok.watson-orchestrate.cloud.ibm.com/instances/4ad36ac0-c576-4e47-8a30-c5ca6055d176/v1/orchestrate/{agent_id}/chat/completions",
        json=json_body,
        headers={"Authorization": f"Bearer {authenticator.token_manager.get_token()}"},
    )

    return response.json()["choices"][0]["message"]["content"]
