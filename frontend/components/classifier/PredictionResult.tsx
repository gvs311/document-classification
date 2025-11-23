"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, FileImage } from "lucide-react";
import type { PredictionResponse } from "@/lib/types";

interface PredictionResultProps {
  prediction: PredictionResponse;
  timestamp: Date;
}

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

export function PredictionResult({
  prediction,
  timestamp,
}: PredictionResultProps) {
  const [showFullDistribution, setShowFullDistribution] = useState(false);

  if (
    !prediction ||
    !prediction.probabilities ||
    !Array.isArray(prediction.probabilities)
  ) {
    return null;
  }

  const allProbs = prediction.probabilities
    .map((prob, idx) => ({ className: CLASS_NAMES[idx], probability: prob }))
    .sort((a, b) => b.probability - a.probability);

  const topProbs = allProbs.slice(0, 3);

  const formattedTime = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Card className="border-border bg-card shadow-lg h-full">
        <CardHeader>
          <CardTitle className="text-xl">Classification Results</CardTitle>
          <CardDescription className="text-muted-foreground">
            Model predictions and confidence scores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Predicted Class Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Predicted Class
              </h3>
              {prediction.abstained ? (
                <Badge
                  variant="outline"
                  className="border-orange-500/50 bg-orange-500/10 text-orange-400 gap-1.5"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Model is unsure
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-green-500/50 bg-green-500/10 text-green-400 gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confident prediction
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold tracking-tight">
                {prediction.label_name}
              </p>
              <Badge
                variant="secondary"
                className="text-lg px-3 py-1 bg-primary/10 text-primary border-primary/20"
              >
                {(prediction.confidence * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>

          {/* Top 3 Predictions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Top 3 Predictions
            </h3>
            <div className="space-y-3">
              {topProbs.map((item, index) => (
                <div key={item.className} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.className}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {(item.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${item.probability * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowFullDistribution(true)}
              className="text-primary hover:text-primary/80 px-0 h-auto"
            >
              View full distribution
            </Button>
          </div>

          {/* Grad-CAM Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Attention Heatmap (Grad-CAM)
            </h3>
            {prediction.gradcam_image ? (
              <>
                <div className="overflow-hidden rounded-xl border border-border bg-secondary/20 shadow-inner">
                  <img
                    src={prediction.gradcam_image || "/placeholder.svg"}
                    alt="Grad-CAM attention heatmap"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Highlighted regions show where the model focused its
                  attention.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/10 p-8">
                <FileImage className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Grad-CAM visualization not available for this prediction.
                </p>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex justify-end pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Last updated: {formattedTime}, today
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Full Distribution Modal */}
      <Dialog
        open={showFullDistribution}
        onOpenChange={setShowFullDistribution}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>All Class Probabilities</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {allProbs.map((item, index) => (
              <div key={item.className} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {index + 1}. {item.className}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {(item.probability * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${item.probability * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
