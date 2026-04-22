from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Education, WorkExperience, Project, Leadership, Volunteer, Achievement, Certification, Skill
from schemas import (
    EducationCreate, EducationResponse,
    WorkExperienceCreate, WorkExperienceResponse,
    ProjectCreate, ProjectResponse,
    LeadershipCreate, LeadershipResponse,
    VolunteerCreate, VolunteerResponse,
    AchievementCreate, AchievementResponse,
    CertificationCreate, CertificationResponse,
    SkillCreate, SkillResponse
)
from routes.auth import get_current_user
from typing import List

router = APIRouter(prefix="/vault", tags=["vault"])

# Education
@router.post("/education", response_model=EducationResponse)
def add_education(data: EducationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Education(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/education", response_model=List[EducationResponse])
def get_education(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Education).filter(Education.user_id == current_user.id).all()

@router.delete("/education/{id}")
def delete_education(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Education).filter(Education.id == id, Education.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Work Experience
@router.post("/work", response_model=WorkExperienceResponse)
def add_work(data: WorkExperienceCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = WorkExperience(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/work", response_model=List[WorkExperienceResponse])
def get_work(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(WorkExperience).filter(WorkExperience.user_id == current_user.id).all()

@router.delete("/work/{id}")
def delete_work(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(WorkExperience).filter(WorkExperience.id == id, WorkExperience.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Projects
@router.post("/projects", response_model=ProjectResponse)
def add_project(data: ProjectCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Project(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.user_id == current_user.id).all()

@router.delete("/projects/{id}")
def delete_project(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Leadership
@router.post("/leadership", response_model=LeadershipResponse)
def add_leadership(data: LeadershipCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Leadership(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/leadership", response_model=List[LeadershipResponse])
def get_leadership(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Leadership).filter(Leadership.user_id == current_user.id).all()

@router.delete("/leadership/{id}")
def delete_leadership(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Leadership).filter(Leadership.id == id, Leadership.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Volunteer
@router.post("/volunteer", response_model=VolunteerResponse)
def add_volunteer(data: VolunteerCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Volunteer(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/volunteer", response_model=List[VolunteerResponse])
def get_volunteer(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Volunteer).filter(Volunteer.user_id == current_user.id).all()

@router.delete("/volunteer/{id}")
def delete_volunteer(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Volunteer).filter(Volunteer.id == id, Volunteer.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Achievements
@router.post("/achievements", response_model=AchievementResponse)
def add_achievement(data: AchievementCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Achievement(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/achievements", response_model=List[AchievementResponse])
def get_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Achievement).filter(Achievement.user_id == current_user.id).all()

@router.delete("/achievements/{id}")
def delete_achievement(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Achievement).filter(Achievement.id == id, Achievement.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Certifications
@router.post("/certifications", response_model=CertificationResponse)
def add_certification(data: CertificationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Certification(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/certifications", response_model=List[CertificationResponse])
def get_certifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Certification).filter(Certification.user_id == current_user.id).all()

@router.delete("/certifications/{id}")
def delete_certification(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Certification).filter(Certification.id == id, Certification.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}

# Skills
@router.post("/skills", response_model=SkillResponse)
def add_skill(data: SkillCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = Skill(**data.model_dump(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Skill).filter(Skill.user_id == current_user.id).all()

@router.delete("/skills/{id}")
def delete_skill(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(Skill).filter(Skill.id == id, Skill.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}