from pathlib import Path
import json

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import inference
from .schemas import (
    PredictionResponse,
    MetricsResponse,
    OverallMetrics,
    PerClassMetric,
    VisualizationsResponse,
    ComparisonImagesResponse,
)


ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT / "assets"
STATIC_DIR = ROOT / "static"

TEST_METRICS_PATH = ASSETS_DIR / "test_metrics.json"

app = FastAPI(title="Document Classifier API")


# ---------- CORS (adjust origin for your Next.js URL) ----------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Static files (for images like confusion matrix, etc.) ----------

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# ---------- Routes ----------

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict-image", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Main classifier:
    - Upload image
    - Get category + confidence
    - 'Model is unsure' flag
    - Grad-CAM heatmap (base64)
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    from PIL import Image
    import io

    try:
        image = Image.open(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")

    (
        label_id,
        label_name,
        confidence,
        abstained,
        probabilities,
    ) = inference.predict(image)

    gradcam_b64 = inference.generate_gradcam(image)

    return PredictionResponse(
        label_id=label_id,
        label_name=label_name,
        confidence=confidence,
        abstained=abstained,
        probabilities=probabilities,
        gradcam_image=gradcam_b64,
    )


# ---------- NEW: PDF → per-page predictions ----------

@app.post("/predict-pdf")
async def predict_pdf(file: UploadFile = File(...)):
    """
    PDF classifier:
    - Upload a PDF
    - Auto-split into pages
    - Classify each page with the existing model
    - Return per-page predictions + Grad-CAM

    NOTE: Requires `pymupdf`:
        pip install pymupdf
    """
    # Basic content-type / extension check
    if (
        not file.filename.lower().endswith(".pdf")
        and "pdf" not in (file.content_type or "")
    ):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    contents = await file.read()

    # Lazy imports so that the app can still start if these libs are missing
    try:
        import fitz  # PyMuPDF
        from PIL import Image
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="PDF support requires 'pymupdf' and 'Pillow' to be installed.",
        )

    try:
        doc = fitz.open(stream=contents, filetype="pdf")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read PDF file")

    if doc.page_count == 0:
        raise HTTPException(status_code=400, detail="PDF has no pages")

    pages_output = []

    for page_index in range(doc.page_count):
        page = doc.load_page(page_index)
        # Render page to an image (PNG in memory)
        pix = page.get_pixmap(dpi=200)  # adjust DPI if needed
        mode = "RGB" if pix.n >= 3 else "L"

        image = Image.frombytes(mode, [pix.width, pix.height], pix.samples)

        # Run your existing single-model prediction
        (
            label_id,
            label_name,
            confidence,
            abstained,
            probabilities,
        ) = inference.predict(image)

        gradcam_b64 = inference.generate_gradcam(image)

        pages_output.append(
            {
                "page_number": page_index + 1,
                "label_id": label_id,
                "label_name": label_name,
                "confidence": confidence,
                "abstained": abstained,
                "probabilities": probabilities,
                "gradcam_image": gradcam_b64,
            }
        )

    return {
        "num_pages": len(pages_output),
        "pages": pages_output,
    }


@app.get("/metrics/test", response_model=MetricsResponse)
def get_test_metrics():
    """
    Returns:
    - overall accuracy, macro F1, weighted F1
    - per-class metrics (precision/recall/F1/support)
    Based on test_metrics.json saved from your notebook.
    """
    if not TEST_METRICS_PATH.exists():
        raise HTTPException(status_code=500, detail="test_metrics.json not found")

    with open(TEST_METRICS_PATH, "r", encoding="utf-8") as f:
        metrics_raw = json.load(f)

    # classification_report-style structure:
    # {"0": {...}, "1": {...}, ..., "accuracy": 0.xx, "macro avg": {...}, "weighted avg": {...}}
    accuracy = float(metrics_raw.get("accuracy", 0.0))
    macro_avg = metrics_raw.get("macro avg", {})
    weighted_avg = metrics_raw.get("weighted avg", {})

    # per-class (keys that are digits)
    per_class = []
    for key, value in metrics_raw.items():
        if not key.isdigit():
            continue
        label_id = int(key)
        label_name = (
            inference.LABEL_NAMES[label_id]
            if 0 <= label_id < len(inference.LABEL_NAMES)
            else key
        )

        per_class.append(
            PerClassMetric(
                label_id=label_id,
                label_name=label_name,
                precision=float(value.get("precision", 0.0)),
                recall=float(value.get("recall", 0.0)),
                f1_score=float(value.get("f1-score", 0.0)),
                support=int(value.get("support", 0)),
            )
        )

    overall = OverallMetrics(
        accuracy=accuracy,
        macro_avg_f1=float(macro_avg.get("f1-score", 0.0)),
        weighted_avg_f1=float(weighted_avg.get("f1-score", 0.0)),
    )

    return MetricsResponse(overall=overall, per_class=per_class)


@app.get("/visualizations", response_model=VisualizationsResponse)
def get_visualizations():
    """
    Returns URLs for:
    - confusion matrix
    - confidence distribution
    """
    base = str("http://localhost:8000").rstrip("/")
    return {
        "confusion_matrix_url": f"{base}/static/confusion_matrix.png",
        "confidence_distribution_url": f"{base}/static/confidence_distribution.png",
    }


@app.get("/comparison/images", response_model=ComparisonImagesResponse)
def get_comparison_images():
    """
    Returns URLs for:
    - ResNet50 vs ViT overall comparison
    - Class-wise F1 comparison chart
    """
    base = str("http://localhost:8000").rstrip("/")
    return {
        "model_comparison_url": f"{base}/static/model_comparison.png",
        "f1_comparison_url": f"{base}/static/f1_score_comparison.png",
    }
