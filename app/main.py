from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chat, code_analysis
from config.settings import get_settings

app = FastAPI()
settings = get_settings()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(code_analysis.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Decentralized Tutor API"}