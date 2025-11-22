import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ComparisonImagesResponse } from "@/lib/types";

interface ComparisonImagesProps {
  images: ComparisonImagesResponse;
}

export function ComparisonImages({ images }: ComparisonImagesProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Model Architecture Comparison</CardTitle>
          <CardDescription>
            Performance comparison between ResNet50 and Vision Transformer
            architectures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <img
              src={images.model_comparison_url}
              alt="Model Comparison Chart"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-2 rounded-lg bg-muted/30 p-4">
            <h4 className="font-medium">Key Insights</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • ResNet50 excels at hierarchical feature extraction through
                residual connections
              </li>
              <li>
                • Vision Transformer leverages self-attention for global context
                understanding
              </li>
              <li>
                • Both models demonstrate strong performance on document
                classification tasks
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>F1 Score Comparison</CardTitle>
          <CardDescription>
            Detailed F1 score breakdown across all document classes for both
            models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <img
              src={images.f1_comparison_url}
              alt="F1 Comparison Chart"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-2 rounded-lg bg-muted/30 p-4">
            <h4 className="font-medium">Performance Analysis</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • F1 scores indicate balanced precision and recall across
                classes
              </li>
              <li>
                • Model selection depends on computational budget and latency
                requirements
              </li>
              <li>
                • Both architectures show robust generalization on test data
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
