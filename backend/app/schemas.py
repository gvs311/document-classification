# backend/app/schemas.py
from typing import List, Optional
from pydantic import BaseModel


class PredictionResponse(BaseModel):
    label_id: int
    label_name: str
    confidence: float
    abstained: bool
    probabilities: List[float]
    gradcam_image: Optional[str] = None  # base64 PNG


class OverallMetrics(BaseModel):
    accuracy: float
    macro_avg_f1: float
    weighted_avg_f1: float


class PerClassMetric(BaseModel):
    label_id: int
    label_name: str
    precision: float
    recall: float
    f1_score: float
    support: int


class MetricsResponse(BaseModel):
    overall: OverallMetrics
    per_class: List[PerClassMetric]


class VisualizationsResponse(BaseModel):
    confusion_matrix_url: str
    confidence_distribution_url: str


class ComparisonImagesResponse(BaseModel):
    model_comparison_url: str
    f1_comparison_url: str
