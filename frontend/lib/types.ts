// Type definitions matching FastAPI backend schemas

export interface PredictionResponse {
  label_id: number;
  label_name: string;
  confidence: number;
  abstained: boolean;
  probabilities: number[];
  gradcam_image: string;
}

export interface OverallMetrics {
  accuracy: number;
  macro_avg_f1: number;
  weighted_avg_f1: number;
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
  confusion_matrix_url: string; // base64 encoded PNG
  confidence_distribution_url: string; // base64 encoded PNG
}

export interface ComparisonImagesResponse {
  model_comparison_url: string; // base64 encoded PNG
  f1_comparison_url: string; // base64 encoded PNG
}
