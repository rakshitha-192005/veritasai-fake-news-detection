import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.ocr_engine import ocr_engine
from app.services.ai_pipeline import ai_pipeline
from app.api.v1.detect import analyze_news
from app.models.prediction import DetectionRequest, PredictionResponse
from app.core.config import settings

router = APIRouter()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image", response_model=PredictionResponse)
async def upload_image_ocr(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (PNG, JPG, JPEG, WEBP).")

    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = ocr_engine.extract_text_from_image(file_path)
    
    req = DetectionRequest(
        text=extracted_text,
        title=f"OCR Scan: {file.filename}",
        input_type="ocr"
    )
    return await analyze_news(req)

@router.post("/upload-document", response_model=PredictionResponse)
async def upload_document_pdf(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file.filename.endswith(".pdf"):
        extracted_text = ocr_engine.extract_text_from_pdf(file_path)
    else:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            extracted_text = f.read()

    req = DetectionRequest(
        text=extracted_text,
        title=f"Doc Scan: {file.filename}",
        input_type="pdf"
    )
    return await analyze_news(req)
