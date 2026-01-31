from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends
from src.routers import audit_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define the origins that are allowed to access your API
# In a production environment, you should replace "*" with specific domains for security
origins = [
    "http://localhost",
    "http://localhost:5173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the defined origins
    allow_credentials=True,  # Allows cookies to be included in cross-origin requests
    allow_methods=[
        "*"
    ],  # Allows all standard HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(audit_router.router)
