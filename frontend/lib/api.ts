import type {
  PredictionResponse,
  MetricsResponse,
  VisualizationsResponse,
  ComparisonImagesResponse,
  PdfPredictionResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function predictImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to predict image");
  }

  return response.json();
}

export async function getTestMetrics(): Promise<MetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/metrics/test`);

  if (!response.ok) {
    throw new Error("Failed to fetch test metrics");
  }

  return response.json();
}

export async function getVisualizations(): Promise<VisualizationsResponse> {
  const response = await fetch(`${API_BASE_URL}/visualizations`);

  if (!response.ok) {
    throw new Error("Failed to fetch visualizations");
  }

  return response.json();
}

export async function getComparisonImages(): Promise<ComparisonImagesResponse> {
  const response = await fetch(`${API_BASE_URL}/comparison/images`);

  if (!response.ok) {
    throw new Error("Failed to fetch comparison images");
  }

  return response.json();
}

export async function predictPdf(file: File): Promise<PdfPredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to analyze PDF");
  }

  return response.json();
}
