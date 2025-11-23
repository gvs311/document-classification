// Type definitions matching FastAPI backend schemas

export interface PredictionResponse {
  label_id: number;
  label_name: string;
  confidence: number;
  abstained: boolean;
  probabilities: number[]; // Array of probabilities for all 10 classes
  gradcam_image: string; // Full data URL (data:image/png;base64,...)
}

export interface PdfPagePrediction {
  page_number: number;
  label_id: number;
  label_name: string;
  confidence: number;
  abstained: boolean;
  probabilities: number[];
  gradcam_image: string;
}

export interface PdfPredictionResponse {
  num_pages: number;
  pages: PdfPagePrediction[];
}

export interface OverallMetrics {
  accuracy: number;
  macro_f1: number;
  weighted_f1: number;
}

export interface PerClassMetric {
  class_name: string;
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface MetricsResponse {
  overall: OverallMetrics;
  per_class: PerClassMetric[];
}

export interface VisualizationsResponse {
  confusion_matrix: string; // base64 encoded PNG
  confidence_distribution: string; // base64 encoded PNG
}

export interface ComparisonImagesResponse {
  model_comparison_chart: string; // base64 encoded PNG
  f1_comparison_chart: string; // base64 encoded PNG
}
