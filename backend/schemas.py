from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

    @field_validator("name")
    def name_must_be_valid(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        if not re.match(r"^[a-zA-Z\s]+$", v):
            raise ValueError("Name must contain only letters")
        return v.strip()

    @field_validator("password")
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("phone")
    def phone_must_be_valid(cls, v):
        if v is None:
            return v
        cleaned = re.sub(r"[\s\-\(\)]", "", v)
        if not re.match(r"^\+?[0-9]{7,15}$", cleaned):
            raise ValueError("Invalid phone number")
        return cleaned

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Education
class EducationCreate(BaseModel):
    institution: str
    degree: str
    field: str
    start_year: str
    end_year: Optional[str] = None
    gpa: Optional[str] = None

class EducationResponse(EducationCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Work Experience
class WorkExperienceCreate(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: Optional[str] = None
    is_current: str = "false"
    responsibilities: Optional[list[str]] = None
    achievements: Optional[list[str]] = None

class WorkExperienceResponse(WorkExperienceCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Project
class ProjectCreate(BaseModel):
    name: str
    description: str
    tech_stack: Optional[list[str]] = None
    problem_solved: Optional[str] = None
    outcome: Optional[str] = None
    link: Optional[str] = None

class ProjectResponse(ProjectCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Leadership
class LeadershipCreate(BaseModel):
    role: str
    organization: str
    description: Optional[str] = None
    impact: Optional[str] = None

class LeadershipResponse(LeadershipCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Volunteer
class VolunteerCreate(BaseModel):
    organization: str
    role: str
    description: Optional[str] = None
    impact: Optional[str] = None

class VolunteerResponse(VolunteerCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Achievement
class AchievementCreate(BaseModel):
    title: str
    description: Optional[str] = None
    year: Optional[str] = None

class AchievementResponse(AchievementCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Certification
class CertificationCreate(BaseModel):
    name: str
    issuer: str
    year: Optional[str] = None
    expiry: Optional[str] = None

class CertificationResponse(CertificationCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Skill
class SkillCreate(BaseModel):
    skill_name: str
    skill_type: str

class SkillResponse(SkillCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Job Session
class JobSessionCreate(BaseModel):
    name: str

class JobSessionResponse(BaseModel):
    id: int
    user_id: int
    name: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Job Description
class JobDescriptionCreate(BaseModel):
    title: Optional[str] = None
    content: str

    @field_validator("content")
    def content_must_not_be_empty(cls, v):
        if len(v.strip()) < 50:
            raise ValueError("Job description seems too short, paste the full JD")
        return v.strip()

class JobDescriptionResponse(BaseModel):
    id: int
    session_id: int
    user_id: int
    title: Optional[str] = None
    content: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True