"use client";

import { useState } from "react";
import { MetricsCards } from "@/components/insights/MetricsCards";
import { PerClassTable } from "@/components/insights/PerClassTable";
import { VisualPanel } from "@/components/insights/VisualPanel";
import { ErrorMessage } from "@/components/ui/error-message";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getTestMetrics, getVisualizations } from "@/lib/api";
import type { MetricsResponse, VisualizationsResponse } from "@/lib/types";
import { BarChart3, RefreshCw } from "lucide-react";

export default function InsightsPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [visualizations, setVisualizations] =
    useState<VisualizationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, visualizationsData] = await Promise.all([
        getTestMetrics(),
        getVisualizations(),
      ]);
      setMetrics(metricsData);
      setVisualizations(visualizationsData);
      setHasLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch insights data"
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
              Model Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl text-pretty">
              Comprehensive performance metrics and visualizations for the
              document classification model
            </p>
          </div>

          <div className="flex h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Load Model Insights</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Click the button below to load comprehensive performance
                  metrics and visualizations
                </p>
              </div>
              <Button onClick={loadData} size="lg" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Load Insights
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
              <Spinner  />
              <p className="text-sm text-muted-foreground">
                Loading model insights...
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
          <h1 className="text-4xl font-bold tracking-tight">Model Insights</h1>
          <p className="text-lg text-muted-foreground max-w-3xl text-pretty">
            Comprehensive performance metrics and visualizations for the
            document classification model
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overall Metrics */}
          {metrics && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Overall Performance
              </h2>
              <MetricsCards metrics={metrics.overall} />
            </section>
          )}

          {/* Per-Class Metrics */}
          {metrics && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Class-Level Analysis
              </h2>
              <PerClassTable metrics={metrics.per_class} />
            </section>
          )}

          {/* Visualizations */}
          {visualizations && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Visual Analysis</h2>
              <VisualPanel visualizations={visualizations} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
