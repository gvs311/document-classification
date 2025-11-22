"use client";

import { useState } from "react";
import { ComparisonImages } from "@/components/comparison/ComparisonImages";
import { ErrorMessage } from "@/components/ui/error-message";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getComparisonImages } from "@/lib/api";
import type { ComparisonImagesResponse } from "@/lib/types";
import { ArrowRight, GitCompare, RefreshCw } from "lucide-react";

export default function ComparisonPage() {
  const [images, setImages] = useState<ComparisonImagesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComparisonImages();
      setImages(data);
      setHasLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch comparison data"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!hasLoaded && !isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Model Comparison
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl text-pretty">
              Comparative analysis of ResNet50 and Vision Transformer
              architectures for document classification
            </p>
          </div>

          {/* Architecture Overview */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-lg font-bold text-primary">R</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">ResNet50</h3>
                      <p className="text-xs text-muted-foreground">
                        Residual Neural Network
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Deep convolutional network with residual connections,
                    enabling effective training of very deep architectures
                    through skip connections and identity mappings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-lg font-bold text-primary">V</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Vision Transformer</h3>
                      <p className="text-xs text-muted-foreground">
                        Attention-Based Architecture
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Transformer-based architecture that processes images as
                    sequences of patches, leveraging multi-head self-attention
                    for global context understanding.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <GitCompare className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Load Comparison Data</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Click the button below to load detailed performance
                  comparisons between the two models
                </p>
              </div>
              <Button onClick={loadData} size="lg" className="gap-2">
                <GitCompare className="h-4 w-4" />
                Load Comparison
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                Loading comparison data...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ErrorMessage message={error} />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={loadData}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Model Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl text-pretty">
            Comparative analysis of ResNet50 and Vision Transformer
            architectures for document classification
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">R</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">ResNet50</h3>
                    <p className="text-xs text-muted-foreground">
                      Residual Neural Network
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Deep convolutional network with residual connections, enabling
                  effective training of very deep architectures through skip
                  connections and identity mappings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">V</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Vision Transformer</h3>
                    <p className="text-xs text-muted-foreground">
                      Attention-Based Architecture
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transformer-based architecture that processes images as
                  sequences of patches, leveraging multi-head self-attention for
                  global context understanding.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Charts */}
        {images && (
          <section>
            <div className="mb-6 flex items-center gap-2">
              <h2 className="text-xl font-semibold">Performance Metrics</h2>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Visual comparison of model capabilities
              </span>
            </div>
            <ComparisonImages images={images} />
          </section>
        )}
      </div>
    </main>
  );
}
