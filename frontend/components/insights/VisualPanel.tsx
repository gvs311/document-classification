import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VisualizationsResponse } from "@/lib/types";

interface VisualPanelProps {
  visualizations: VisualizationsResponse;
}

export function VisualPanel({ visualizations }: VisualPanelProps) {
  console.log(visualizations, "visualizations");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix</CardTitle>
          <CardDescription>
            Model prediction accuracy across all classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <img
              src={visualizations.confusion_matrix_url}
              alt="Confusion Matrix"
              className="w-full h-auto"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confidence Distribution</CardTitle>
          <CardDescription>
            Distribution of model prediction confidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <img
              src={visualizations.confidence_distribution_url}
              alt="Confidence Distribution"
              className="w-full h-auto"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
