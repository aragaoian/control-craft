<div align="center">
  <h1>
    Control-Craft
  </h1>
  <p style="max-width: 600px;">
     AI-powered process audit and redesign using IBM Watsonx Agents
  </p>
</div>

In this hackathon, we design and build a proof-of-concept agentic AI solution using IBM watsonx Orchestrate, a low-code platform to build and deploy AI agents.

**Overview**
- **Goal:** Build an approachable, practical AI agent that automates workflows, connects tools, and turns insights into actions — demonstrating the path from idea to deployment.
- **Theme:** "AI Demystified — From idea to deployment" — show how low-code orchestration accelerates productization.

**Repository Structure**
- **Backend:** Python service and agent logic — see [backend/main.py](backend/main.py) and [backend/src/services/agent.py](backend/src/services/agent.py).
- **Frontend:** React + Vite UI for interacting with the agent — see [frontend/app/root.tsx](frontend/app/root.tsx) and [frontend/app/lib/agentClient.ts](frontend/app/lib/agentClient.ts).

**Architecture (high level)**
- **User UI (Frontend):** collects user intents and displays agent responses.
- **Agent Layer (Backend):** orchestrates tasks, calls external APIs, and holds business logic in `agent.py`.
- **Integrations:** placeholders and helpers for IBM watsonx Orchestrate integration, plus a Cloudant helper in [backend/src/cloudant.py](backend/src/cloudant.py) for optional persistence.

**Key Components**
- **Agent service:** [backend/src/services/agent.py](backend/src/services/agent.py) — core orchestration and decision logic.
- **API routes:** [backend/src/routers/audit_router.py](backend/src/routers/audit_router.py) and [backend/src/controllers/audit_controller.py](backend/src/controllers/audit_controller.py).
- **Frontend client:** [frontend/app/lib/agentClient.ts](frontend/app/lib/agentClient.ts) — HTTP client to the backend.

**Getting Started (local)**

Backend (Python)
```bash
# create and activate a venv
python3 -m venv .venv
source .venv/bin/activate
# install dependencies
pip install -r backend/requirements.txt || pip install -r backend/pyproject.toml
# set env vars from .env.example and run
cp backend/.env.example backend/.env
python backend/main.py
```

Frontend (Node)
```bash
cd frontend
npm install
npm run dev
```

Notes:
- The backend includes an example `.env.example` at [backend/.env.example](backend/.env.example). Configure credentials and endpoint URLs (for watsonx Orchestrate, Cloudant, etc.) before running.
- If `requirements.txt` is not present, use the `pyproject.toml` from [backend/pyproject.toml](backend/pyproject.toml) to install dependencies.

**IBM watsonx Orchestrate integration**
- This project is a proof-of-concept: integration points are implemented as placeholders in `agent.py` and `agentClient.ts`.
- To connect to watsonx Orchestrate, provide API keys and endpoints in the backend `.env` and implement the orchestration calls where indicated in [backend/src/services/agent.py](backend/src/services/agent.py).

**How to demo**
- Start backend and frontend locally, open the UI, and trigger an example flow. The UI sends an intent to the backend which returns an agent-driven response. Capture screenshots or record a short demo video to show the end-to-end flow.

**Testing & Samples**
- Example BPMN files for testing flows are in [backend/tests/](backend/tests/).

**Extending the project**
- Implement a full watsonx Orchestrate connector in `agent.py` and add orchestration definitions.
- Add authentication and secure storage for API keys (Vault/IBM Cloud Secrets).

**Contacts & Credits**
- Team: Baguncinha
- Event: IBM DEV DAY Hackathon

If you want, I can also add a quick demo script, containerization notes, or implement the watsonx Orchestrate connector — tell me which next.
Control-Craft