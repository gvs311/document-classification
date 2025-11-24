"use client";

import { useState } from "react";
import { UploadPanel } from "@/components/classifier/UploadPanel";
import { PredictionResult } from "@/components/classifier/PredictionResult";
import { Spinner } from "@/components/ui/spinner";
import { FileText, AlertCircle } from "lucide-react";
import { predictImage } from "@/lib/api";
import type { PredictionResponse } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [predictionTime, setPredictionTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    // Reset prediction when new file is selected
    if (file !== selectedFile) {
      setPrediction(null);
      setPredictionTime(null);
      setError(null);
    }
  };

  const handleClassify = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictImage(selectedFile);
      setPrediction(result);
      setPredictionTime(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to classify document"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative">
      {/* Radial glow effect */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col">
            <UploadPanel
              onFileSelect={handleFileSelect}
              onClassify={handleClassify}
              isLoading={isLoading}
              selectedFile={selectedFile}
            />
          </div>

          <div className="flex flex-col">
            {isLoading && (
              <div className="flex h-full min-h-[600px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Spinner />
                  <p className="text-base text-muted-foreground animate-pulse">
                    Classifying...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <Alert
                variant="destructive"
                className="border-destructive/50 bg-destructive/10"
              >
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg">
                  Classification failed
                </AlertTitle>
                <AlertDescription className="text-base">
                  We couldn&apos;t classify this document. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Results State */}
            {prediction && predictionTime && !isLoading && !error && (
              <PredictionResult
                prediction={prediction}
                timestamp={predictionTime}
              />
            )}

            {/* Empty State */}
            {!isLoading && !prediction && !error && (
              <div className="flex h-full min-h-[600px] items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-accent/10 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/50" />
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      No document classified yet
                    </p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Upload a document on the left to see predictions and the
                      attention heatmap.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
