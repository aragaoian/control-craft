from fastapi import HTTPException, UploadFile
from os import getenv


from src.services.agent import completions


async def agent_response(bpmn_file: UploadFile) -> dict:
    # validation
    if bpmn_file.filename:
        if not bpmn_file.filename.endswith(".bpmn"):
            raise HTTPException(status_code=400, detail="Invalid file")
    else:
        raise HTTPException(status_code=400, detail="Invalid file")

    # AI
    content = await bpmn_file.read()
    bpmn_content = content.decode("utf-8")
    analysis = completions(getenv("ANALYSIS_AGENT_ID"), bpmn_content)
    generated = completions(
        getenv("GENERATOR_AGENT_ID"), f"{bpmn_content} \n\n {analysis}"
    )
    #get xml from generated response
    try:
        generated_xml = generated.split("```xml")[1].split("```")[0]
    except IndexError:
        print(generated)
        generated_xml = generated
    fixer = completions(getenv("FIXER_AGENT_ID"), generated_xml)

    return {
        "analysis": analysis,
        "generated": fixer
    }
