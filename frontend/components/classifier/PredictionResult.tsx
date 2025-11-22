"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PredictionResponse } from "@/lib/types";

interface PredictionResultProps {
  prediction: PredictionResponse;
}

// Class names mapping (in order matching probabilities array from backend)
const CLASS_NAMES = [
  "ADVE",
  "Email",
  "Form",
  "Letter",
  "Memo",
  "News",
  "Note",
  "Report",
  "Resume",
  "Scientific",
];

export function PredictionResult({ prediction }: PredictionResultProps) {
  console.log("[v0] PredictionResult received prediction:", prediction);

  if (
    !prediction ||
    !prediction.probabilities ||
    !Array.isArray(prediction.probabilities)
  ) {
    console.log("[v0] Invalid prediction data:", prediction);
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Invalid prediction data received
          </p>
        </CardContent>
      </Card>
    );
  }

  const topProbs = prediction.probabilities
    .map((prob, idx) => ({ className: CLASS_NAMES[idx], probability: prob }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Results</CardTitle>
        <CardDescription>
          Model predictions and confidence scores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predicted Class */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Predicted Class
            </h3>
            {prediction.abstained && (
              <Badge
                variant="outline"
                className="border-orange-500 bg-orange-500/10 text-orange-500"
              >
                Model is unsure
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold">{prediction.label_name}</p>
            <Badge variant="secondary" className="text-base">
              {(prediction.confidence * 100).toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* Top 3 Probabilities */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Top 3 Predictions
          </h3>
          <div className="space-y-2">
            {topProbs.map((item) => (
              <div key={item.className} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.className}</span>
                  <span className="text-muted-foreground">
                    {(item.probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${item.probability * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grad-CAM Heatmap */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Attention Heatmap (Grad-CAM)
          </h3>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <img
              src={prediction.gradcam_image || "/placeholder.svg"}
              alt="Grad-CAM heatmap"
              className="w-full h-auto"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Highlighted regions show where the model focused its attention
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
