from fastapi import APIRouter, UploadFile
from src.controllers.audit_controller import agent_response

router = APIRouter()


@router.post("/control-craft-agent")
async def index(bpmn_file: UploadFile):
    return await agent_response(bpmn_file)
