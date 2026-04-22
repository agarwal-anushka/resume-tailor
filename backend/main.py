from fastapi import FastAPI
from database import Base, engine
from routes.auth import router as auth_router
from routes.vault import router as vault_router
from routes.parser import router as parser_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(vault_router)
app.include_router(parser_router)

@app.get("/")
def root():
    return {"message": "Resume Tailor API is running"}