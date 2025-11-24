export interface PredictionResponse {
  label_id: number;
  label_name: string;
  confidence: number;
  abstained: boolean;
  probabilities: number[];
  gradcam_image: string;
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
  confusion_matrix_url: string;
  confidence_distribution_url: string;
}

export interface ComparisonImagesResponse {
  model_comparison_url: string;
  f1_comparison_url: string;
}
