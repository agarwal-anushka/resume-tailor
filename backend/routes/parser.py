from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Education, WorkExperience, Project, Leadership, Volunteer, Achievement, Certification, Skill
from routes.auth import get_current_user
from groq import Groq
from dotenv import load_dotenv
import pdfplumber
import docx
import json
import os
import io

load_dotenv()

router = APIRouter(prefix="/parser", tags=["parser"])

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    import fitz
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = []
    
    for page in doc:
        text = page.get_text()
        # Extract hyperlinks from page annotations
        links = page.get_links()
        for link in links:
            if link.get("uri"):
                url = link["uri"]
                # Find the text in the rect area of the link
                rect = fitz.Rect(link["from"])
                link_text = page.get_text("text", clip=rect).strip()
                if link_text:
                    text = text.replace(link_text, f"{link_text} [{url}]")
        full_text.append(text)
    
    doc.close()
    return "\n".join(full_text)


def extract_text_from_docx(file_bytes: bytes) -> tuple[str, dict]:
    doc = docx.Document(io.BytesIO(file_bytes))
    
    # Extract hyperlinks from relationships
    hyperlinks = {}
    for rel in doc.part.rels.values():
        if "hyperlink" in rel.reltype:
            hyperlinks[rel.rId] = rel._target
    
    # Extract text with hyperlink markers
    from docx.oxml.ns import qn
    full_text = []
    for para in doc.paragraphs:
        para_text = para.text
        # Check for hyperlinks in paragraph XML
        for hyperlink in para._p.findall(f'.//{qn("w:hyperlink")}'):
            r_id = hyperlink.get(qn("r:id"))
            if r_id and r_id in hyperlinks:
                link_text = "".join(r.text for r in hyperlink.findall(f'.//{qn("w:t")}') if r.text)
                url = hyperlinks[r_id]
                para_text = para_text.replace(link_text, f"{link_text} [{url}]")
        full_text.append(para_text)
    
    return "\n".join(full_text)

def parse_resume_with_llm(raw_text: str) -> dict:
    prompt = f"""
You are a resume parser. Extract all information from the resume below and return ONLY a JSON object with no explanation, no markdown, no backticks.

The JSON must follow this exact structure:
{{
    "education": [
        {{
            "institution": "",
            "degree": "",
            "field": "",
            "start_year": "",
            "end_year": "",
            "gpa": ""
        }}
    ],
    "work_experience": [
        {{
            "company": "",
            "role": "",
            "start_date": "",
            "end_date": "",
            "is_current": "false",
            "responsibilities": [],
            "achievements": []
        }}
    ],
    "projects": [
        {{
            "name": "",
            "description": "",
            "tech_stack": [],
            "problem_solved": "",
            "outcome": ""
            "link": ""
        }}
    ],
    "leadership": [
        {{
            "role": "",
            "organization": "",
            "description": "",
            "impact": ""
        }}
    ],
    "volunteer": [
        {{
            "organization": "",
            "role": "",
            "description": "",
            "impact": ""
        }}
    ],
    "achievements": [
        {{
            "title": "",
            "description": "",
            "year": ""
        }}
    ],
    "certifications": [
        {{
            "name": "",
            "issuer": "",
            "year": "",
            "expiry": ""
        }}
    ],
    "skills": [
        {{
            "skill_name": "",
            "skill_type": "technical"
        }}
    ]
}}

Rules:
- If a section has no data, return an empty array for it
- For skills, skill_type must be either "technical" or "soft"
- For is_current, use "true" if it is the current job, otherwise "false"
- Return ONLY the JSON, nothing else
- If the same experience appears in multiple sections (e.g. work experience and leadership), place it in the most appropriate single section only. Never duplicate content across sections.
- For projects, extract any GitHub links, demo links, or URLs mentioned near the project name or description and put them in the link field. If no link found, leave it empty.
Resume:
{raw_text}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)


def save_parsed_data(parsed: dict, user_id: int, db: Session):
    for item in parsed.get("education", []):
        db.add(Education(**item, user_id=user_id))

    for item in parsed.get("work_experience", []):
        db.add(WorkExperience(**item, user_id=user_id))

    for item in parsed.get("projects", []):
        db.add(Project(**item, user_id=user_id))

    for item in parsed.get("leadership", []):
        db.add(Leadership(**item, user_id=user_id))

    for item in parsed.get("volunteer", []):
        db.add(Volunteer(**item, user_id=user_id))

    for item in parsed.get("achievements", []):
        db.add(Achievement(**item, user_id=user_id))

    for item in parsed.get("certifications", []):
        db.add(Certification(**item, user_id=user_id))

    for item in parsed.get("skills", []):
        db.add(Skill(**item, user_id=user_id))

    db.commit()


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_bytes = file.file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        raw_text = extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    parsed = parse_resume_with_llm(raw_text)
    save_parsed_data(parsed, current_user.id, db)

    return {"message": "Resume parsed and vault populated successfully", "sections_found": list(parsed.keys())}