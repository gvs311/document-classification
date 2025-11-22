"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PredictionResponse } from "@/lib/types"

interface PredictionResultProps {
  prediction: PredictionResponse
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  const topProbs = Object.entries(prediction.top_k_probabilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Results</CardTitle>
        <CardDescription>Model predictions and confidence scores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predicted Class */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Predicted Class</h3>
            {prediction.abstained && (
              <Badge variant="outline" className="border-orange-500 bg-orange-500/10 text-orange-500">
                Model is unsure
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold">{prediction.predicted_class}</p>
            <Badge variant="secondary" className="text-base">
              {(prediction.confidence * 100).toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* Top 3 Probabilities */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Top 3 Predictions</h3>
          <div className="space-y-2">
            {topProbs.map(([className, prob]) => (
              <div key={className} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{className}</span>
                  <span className="text-muted-foreground">{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${prob * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grad-CAM Heatmap */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Attention Heatmap (Grad-CAM)</h3>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <img
              src={`data:image/png;base64,${prediction.gradcam_image}`}
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
  )
}
