"use client";

import { useState } from "react";
import { UploadPanel } from "@/components/classifier/UploadPanel";
import { PredictionResult } from "@/components/classifier/PredictionResult";
import { ErrorMessage } from "@/components/ui/error-message";
import { Spinner } from "@/components/ui/spinner";
import { predictImage } from "@/lib/api";
import type { PredictionResponse } from "@/lib/types";

export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClassify = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log("[v0] Starting classification for file:", selectedFile.name);
      const result = await predictImage(selectedFile);
      console.log("[v0] Received prediction result:", result);
      setPrediction(result);
    } catch (err) {
      console.log("[v0] Classification error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to classify document"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Document Classifier
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Upload a document image to classify its type using state-of-the-art
            deep learning models
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <UploadPanel
              onFileSelect={setSelectedFile}
              onClassify={handleClassify}
              isLoading={isLoading}
              selectedFile={selectedFile}
            />
          </div>

          <div>
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Spinner />
                  <p className="text-sm text-muted-foreground">
                    Analyzing document...
                  </p>
                </div>
              </div>
            )}

            {error && <ErrorMessage message={error} />}

            {prediction && !isLoading && (
              <PredictionResult prediction={prediction} />
            )}

            {!isLoading && !prediction && !error && (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 p-12">
                <p className="text-center text-muted-foreground">
                  Upload and classify a document to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
