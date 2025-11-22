// Type definitions matching FastAPI backend schemas

export interface PredictionResponse {
  predicted_class: string
  confidence: number
  abstained: boolean
  top_k_probabilities: Record<string, number>
  gradcam_image: string // base64 encoded PNG
}

export interface OverallMetrics {
  accuracy: number
  macro_f1: number
  weighted_f1: number
}

export interface PerClassMetric {
  class_name: string
  precision: number
  recall: number
  f1_score: number
  support: number
}

export interface MetricsResponse {
  overall: OverallMetrics
  per_class: PerClassMetric[]
}

export interface VisualizationsResponse {
  confusion_matrix: string // base64 encoded PNG
  confidence_distribution: string // base64 encoded PNG
}

export interface ComparisonImagesResponse {
  model_comparison_chart: string // base64 encoded PNG
  f1_comparison_chart: string // base64 encoded PNG
}
