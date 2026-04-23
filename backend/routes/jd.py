from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import User, JobSession, JobDescription
from schemas import JobSessionCreate, JobSessionResponse, JobDescriptionCreate, JobDescriptionResponse
from routes.auth import get_current_user
from typing import List
import pdfplumber
import docx
import io

router = APIRouter(prefix="/jd", tags=["jd"])


# Session endpoints
@router.post("/sessions", response_model=JobSessionResponse)
def create_session(data: JobSessionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = JobSession(name=data.name, user_id=current_user.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=List[JobSessionResponse])
def get_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(JobSession).filter(JobSession.user_id == current_user.id).all()


@router.delete("/sessions/{session_id}")
def delete_session(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(JobSession.id == session_id, JobSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.query(JobDescription).filter(JobDescription.session_id == session_id).delete()
    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}


# JD endpoints
@router.post("/sessions/{session_id}/jds", response_model=JobDescriptionResponse)
def add_jd_text(session_id: int, data: JobDescriptionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(JobSession.id == session_id, JobSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    jd = JobDescription(
        session_id=session_id,
        user_id=current_user.id,
        title=data.title,
        content=data.content
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)
    return jd


@router.post("/sessions/{session_id}/jds/upload", response_model=JobDescriptionResponse)
def add_jd_file(session_id: int, title: str = None, file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(JobSession.id == session_id, JobSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    file_bytes = file.file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            content = "\n".join([p.extract_text() for p in pdf.pages if p.extract_text()])
    elif filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(file_bytes))
        content = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    else:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    if not content.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    if len(content.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description seems too short")

    jd = JobDescription(
        session_id=session_id,
        user_id=current_user.id,
        title=title or file.filename,
        content=content
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)
    return jd


@router.get("/sessions/{session_id}/jds", response_model=List[JobDescriptionResponse])
def get_jds(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(JobSession.id == session_id, JobSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return db.query(JobDescription).filter(JobDescription.session_id == session_id).all()


@router.delete("/sessions/{session_id}/jds/{jd_id}")
def delete_jd(session_id: int, jd_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    jd = db.query(JobDescription).filter(
        JobDescription.id == jd_id,
        JobDescription.session_id == session_id,
        JobDescription.user_id == current_user.id
    ).first()
    if not jd:
        raise HTTPException(status_code=404, detail="JD not found")
    db.delete(jd)
    db.commit()
    return {"message": "JD deleted successfully"}

@router.get("/sessions/{session_id}/summary")
def get_session_summary(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(
        JobSession.id == session_id,
        JobSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    jds = db.query(JobDescription).filter(
        JobDescription.session_id == session_id
    ).all()

    return {
        "session_id": session.id,
        "name": session.name,
        "status": session.status,
        "created_at": session.created_at,
        "total_jds": len(jds),
        "done": len([j for j in jds if j.status == "done"]),
        "failed": len([j for j in jds if j.status == "failed"]),
        "pending": len([j for j in jds if j.status == "pending"]),
        "jds": [
            {
                "id": j.id,
                "title": j.title,
                "status": j.status,
                "created_at": j.created_at
            } for j in jds
        ]
    }


@router.patch("/sessions/{session_id}/rename")
def rename_session(session_id: int, data: JobSessionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(
        JobSession.id == session_id,
        JobSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.name = data.name
    db.commit()
    db.refresh(session)
    return {"message": "Session renamed", "name": session.name}