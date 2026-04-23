from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, JobSession, JobDescription, TailoredResume
from models import Education, WorkExperience, Project, Leadership, Volunteer, Achievement, Certification, Skill
from routes.auth import get_current_user
from groq import Groq
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import json
import os

load_dotenv()

router = APIRouter(prefix="/tailor", tags=["tailor"])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_full_vault(user_id: int, db: Session) -> tuple[dict, dict]:
    def serialize(records):
        result = []
        for r in records:
            d = {c.name: getattr(r, c.name) for c in r.__table__.columns}
            result.append(d)
        return result

    user = db.query(User).filter(User.id == user_id).first()
    user_info = {
        "name": user.name if user else "",
        "email": user.email if user else "",
        "phone": user.phone if user else "",
        "linkedin": user.linkedin if user else "",
        "github": user.github if user else "",
        "portfolio": user.portfolio if user else ""
    }

    vault = {
        "education": serialize(db.query(Education).filter(Education.user_id == user_id).all()),
        "work_experience": serialize(db.query(WorkExperience).filter(WorkExperience.user_id == user_id).all()),
        "projects": serialize(db.query(Project).filter(Project.user_id == user_id).all()),
        "leadership": serialize(db.query(Leadership).filter(Leadership.user_id == user_id).all()),
        "volunteer": serialize(db.query(Volunteer).filter(Volunteer.user_id == user_id).all()),
        "achievements": serialize(db.query(Achievement).filter(Achievement.user_id == user_id).all()),
        "certifications": serialize(db.query(Certification).filter(Certification.user_id == user_id).all()),
        "skills": serialize(db.query(Skill).filter(Skill.user_id == user_id).all()),
    }

    return vault, user_info

def call1_select(vault: dict, jd_content: str) -> dict:
    prompt = f"""
You are a resume strategist. Given a candidate's experience vault and a job description, select the most relevant items to include in a tailored resume.

Return ONLY a JSON object with no explanation, no markdown, no backticks. Format:
{{
    "education_ids": [],
    "work_experience_ids": [],
    "project_ids": [],
    "leadership_ids": [],
    "volunteer_ids": [],
    "achievement_ids": [],
    "certification_ids": [],
    "skill_ids": []
}}

Rules:
- Select maximum 3 work experiences, 3 projects, 5 skills most relevant to the JD
- Select all education entries
- Only include IDs that exist in the vault
- Return ONLY the JSON

Vault:
{json.dumps(vault, indent=2, default=str)}

Job Description:
{jd_content}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)


def fetch_selected_items(selected_ids: dict, vault: dict) -> dict:
    def filter_by_ids(items, ids):
        return [item for item in items if item["id"] in ids]

    return {
        "education": filter_by_ids(vault["education"], selected_ids.get("education_ids", [])),
        "work_experience": filter_by_ids(vault["work_experience"], selected_ids.get("work_experience_ids", [])),
        "projects": filter_by_ids(vault["projects"], selected_ids.get("project_ids", [])),
        "leadership": filter_by_ids(vault["leadership"], selected_ids.get("leadership_ids", [])),
        "volunteer": filter_by_ids(vault["volunteer"], selected_ids.get("volunteer_ids", [])),
        "achievements": filter_by_ids(vault["achievements"], selected_ids.get("achievement_ids", [])),
        "certifications": filter_by_ids(vault["certifications"], selected_ids.get("certification_ids", [])),
        "skills": filter_by_ids(vault["skills"], selected_ids.get("skill_ids", [])),
    }


def call2_write(selected_items: dict, jd_content: str, user_info: dict) -> dict:
    prompt = f"""
You are an expert resume writer who has helped thousands of candidates land jobs at top companies. Your writing is known for sounding genuinely human, not AI generated.

Rewrite the candidate's selected experience tailored to the job description below.

Critical rules:
- Write like a real human wrote this resume, not an AI. Vary sentence structure, vary bullet length, avoid starting every bullet with the same type of word
- Do NOT use these overused AI phrases: "Leveraged", "Spearheaded", "Utilized", "Implemented", "Developed" as openers for every bullet. Use them sparingly and only when natural
- Incorporate 4-6 keywords from the JD naturally within context — never force them, never repeat the same keyword more than twice
- Bullets should describe real impact and outcomes, not just tasks
- PRESERVE ALL NUMBERS AND METRICS exactly as stated. If the candidate says 100+ companies, keep 100+. If they say 40% improvement, keep 40%. Never remove or approximate numbers — they are critical for ATS scoring
- Vary bullet length — some short and punchy, some with context and numbers
- Do NOT write a generic summary. Write 2 sentences max that directly address what this specific JD is looking for using the candidate's actual strongest relevant experience
- Do not fabricate any numbers or experience that is not in the vault
- The candidate's contact info is provided separately — use it exactly as given
- Return ONLY a JSON object with no explanation, no markdown, no backticks
- For projects, if a link exists in the vault data preserve it exactly in the link field

Return this exact structure:
{{
    "name": "{user_info.get('name', '')}",
    "email": "{user_info.get('email', '')}",
    "phone": "{user_info.get('phone', '')}",
    "linkedin": "{user_info.get('linkedin', '')}",
    "github": "{user_info.get('github', '')}",
    "portfolio": "{user_info.get('portfolio', '')}",
    "summary": "",
    "education": [],
    "work_experience": [
        {{
            "company": "",
            "role": "",
            "start_date": "",
            "end_date": "",
            "bullets": []
        }}
    ],
    "projects": [
        {{
            "name": "",
            "link": "",
            "tech_stack": [],
            "bullets": []
        }}
    ],
    "leadership": [],
    "volunteer": [],
    "achievements": [],
    "certifications": [],
    "skills": {{
        "technical": [],
        "soft": []
    }}
}}

Selected Experience:
{json.dumps(selected_items, indent=2, default=str)}

Job Description:
{jd_content}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)


def process_single_jd(jd_id: int, user_id: int, vault: dict, user_info: dict, db_url: str):
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine(db_url)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
        if not jd:
            print(f"ERROR: JD {jd_id} not found")
            return

        print(f"INFO: Starting JD {jd_id} — vault has {sum(len(v) for v in vault.values())} items")

        selected_ids = call1_select(vault, jd.content)
        print(f"INFO: Call 1 done for JD {jd_id} — selected: {selected_ids}")

        selected_items = fetch_selected_items(selected_ids, vault)
        print(f"INFO: Fetched selected items for JD {jd_id}")

        tailored_content = call2_write(selected_items, jd.content, user_info)
        print(f"INFO: Call 2 done for JD {jd_id}")

        record = TailoredResume(
            jd_id=jd.id,
            user_id=user_id,
            content=json.dumps(tailored_content)
        )
        db.add(record)
        jd.status = "done"
        db.commit()
        print(f"INFO: JD {jd_id} completed successfully")

    except Exception as e:
        import traceback
        print(f"ERROR processing JD {jd_id}: {type(e).__name__}: {str(e)}")
        print(traceback.format_exc())
        try:
            jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
            if jd:
                jd.status = "failed"
                db.commit()
        except:
            pass
    finally:
        db.close()

        
@router.post("/sessions/{session_id}")
def tailor_session(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(
        JobSession.id == session_id,
        JobSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
def get_results(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    jds = db.query(JobDescription).filter(
        JobDescription.session_id == session_id,
        JobDescription.user_id == current_user.id
    ).all()

    results = []
    for jd in jds:
        tailored = db.query(TailoredResume).filter(TailoredResume.jd_id == jd.id).first()
        results.append({
            "jd_id": jd.id,
            "jd_title": jd.title,
            "status": jd.status,
            "tailored_resume_id": tailored.id if tailored else None
        })

    return results

@router.post("/sessions/{session_id}/retry")
def retry_failed(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(JobSession).filter(
        JobSession.id == session_id,
        JobSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    failed_jds = db.query(JobDescription).filter(
        JobDescription.session_id == session_id,
        JobDescription.status == "failed"
    ).all()

    if not failed_jds:
        raise HTTPException(status_code=400, detail="No failed JDs found in this session")

    # Reset failed JDs to pending
    for jd in failed_jds:
        jd.status = "pending"
    db.commit()

    vault, user_info = get_full_vault(current_user.id, db)
    db_url = os.getenv("DATABASE_URL")
    jd_ids = [jd.id for jd in failed_jds]

    with ThreadPoolExecutor(max_workers=5) as executor:
        for jd_id in jd_ids:
            executor.submit(process_single_jd, jd_id, current_user.id, vault, user_info, db_url)

    return {"message": f"Retrying {len(jd_ids)} failed JDs", "jd_ids": jd_ids}