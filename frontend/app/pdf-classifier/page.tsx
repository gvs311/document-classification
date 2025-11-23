"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { predictPdf } from "@/lib/api";
import type { PdfPredictionResponse, PdfPagePrediction } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PdfClassifierPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PdfPredictionResponse | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setSelectedPageIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await predictPdf(file);
      setResult(response);
      if (response.pages.length > 0) {
        setSelectedPageIndex(0);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not analyze this PDF. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPage =
    selectedPageIndex !== null && result
      ? result.pages[selectedPageIndex]
      : null;

  const summary = result ? computeSummary(result.pages) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1800px] p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            PDF Document Classifier
          </h1>
          <p className="mt-2 text-muted-foreground">
            Analyze multi-page PDF documents with page-level classification and
            explainability
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr_1fr]">
          {/* LEFT PANEL: Upload & Summary */}
          <div className="space-y-6">
            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload PDF</CardTitle>
                <CardDescription>
                  Upload a PDF to classify each page and inspect model
                  explanations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border",
                    isLoading && "pointer-events-none opacity-50"
                  )}
                >
                  <Upload
                    className={cn(
                      "mb-4 h-10 w-10",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="mb-2 text-center text-sm font-medium">
                    {file ? file.name : "Drag and drop your PDF here"}
                  </p>
                  <p className="mb-4 text-center text-xs text-muted-foreground">
                    or
                  </p>
                  <label>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      asChild
                    >
                      <span className="cursor-pointer">Select PDF</span>
                    </Button>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileSelect(e.target.files?.[0] || null)
                      }
                      disabled={isLoading}
                    />
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!file || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Analyzing..." : "Analyze PDF"}
                </Button>
              </CardContent>
            </Card>

            {/* Summary Card */}
            {summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Document-level analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Pages
                    </span>
                    <Badge variant="secondary">{result?.num_pages}</Badge>
                  </div>

                  <Separator />

                  <div>
                    <div className="mb-2 text-sm font-medium">
                      Most Frequent Label
                    </div>
                    <Badge className="text-sm">
                      {summary.mostFrequentLabel}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <div className="mb-3 text-sm font-medium">
                      Label Distribution
                    </div>
                    <div className="space-y-2">
                      {summary.labelStats.map((stat) => (
                        <div key={stat.label} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{stat.label}</span>
                            <span className="text-muted-foreground">
                              {stat.count} pages (
                              {stat.avgConfidence.toFixed(1)}% avg conf)
                            </span>
                          </div>
                          <Progress
                            value={
                              (stat.count / (result?.num_pages || 1)) * 100
                            }
                            className="h-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {summary.unsureCount > 0 && (
                    <>
                      <Separator />
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Unsure Pages</AlertTitle>
                        <AlertDescription>
                          {summary.unsureCount}{" "}
                          {summary.unsureCount === 1
                            ? "page has"
                            : "pages have"}{" "}
                          low confidence or abstained predictions
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* MIDDLE PANEL: Pages List */}
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>
                {result
                  ? `${result.num_pages} pages analyzed`
                  : "No PDF analyzed yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : result ? (
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-2 pr-4">
                    {result.pages.map((page, index) => {
                      const isUnsure = page.abstained || page.confidence < 0.5;
                      const isSelected = selectedPageIndex === index;

                      return (
                        <button
                          key={page.page_number}
                          onClick={() => setSelectedPageIndex(index)}
                          className={cn(
                            "w-full rounded-lg border p-4 text-left transition-all hover:border-primary",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Page {page.page_number}
                                </span>
                              </div>
                              <div className="mb-2 text-base font-semibold">
                                {page.label_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Confidence: {(page.confidence * 100).toFixed(1)}
                                %
                              </div>
                            </div>
                            <Badge
                              variant={isUnsure ? "destructive" : "secondary"}
                            >
                              {isUnsure ? "Unsure" : "Confident"}
                            </Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-[400px] flex-col items-center justify-center text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload and analyze a PDF to see page results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT PANEL: Page Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
              <CardDescription>
                {selectedPage
                  ? `Page ${selectedPage.page_number} analysis`
                  : "Select a page to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : selectedPage ? (
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-6 pr-4">
                    {/* Header */}
                    <div>
                      <h3 className="mb-2 text-2xl font-bold">
                        Page {selectedPage.page_number} —{" "}
                        {selectedPage.label_name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Confidence
                          </span>
                          <span className="text-2xl font-bold">
                            {(selectedPage.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={selectedPage.confidence * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    {/* Warning for low confidence */}
                    {(selectedPage.abstained ||
                      selectedPage.confidence < 0.5) && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Model is unsure</AlertTitle>
                        <AlertDescription>
                          The confidence for this page is low. Treat this
                          prediction with caution.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Separator />

                    {/* Probabilities Section */}
                    <div>
                      <h4 className="mb-3 text-sm font-semibold">
                        Class Probabilities
                      </h4>
                      <div className="space-y-2">
                        {selectedPage.probabilities.map((prob, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">Class {idx}</span>
                              <span className="text-muted-foreground">
                                {(prob * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={prob * 100} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Grad-CAM Section */}
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">
                        Grad-CAM Explanation
                      </h4>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Highlights indicate regions most influential for this
                        prediction.
                      </p>
                      <div className="overflow-hidden rounded-lg border border-border">
                        <img
                          src={selectedPage.gradcam_image || "/placeholder.svg"}
                          alt={`Grad-CAM for page ${selectedPage.page_number}`}
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-[400px] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Select a page from the list to see detailed analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to compute summary statistics
function computeSummary(pages: PdfPagePrediction[]) {
  // Count labels
  const labelCounts = new Map<
    string,
    { count: number; totalConfidence: number }
  >();

  pages.forEach((page) => {
    const existing = labelCounts.get(page.label_name) || {
      count: 0,
      totalConfidence: 0,
    };
    labelCounts.set(page.label_name, {
      count: existing.count + 1,
      totalConfidence: existing.totalConfidence + page.confidence,
    });
  });

  // Get most frequent label
  let mostFrequentLabel = "";
  let maxCount = 0;
  labelCounts.forEach((data, label) => {
    if (data.count > maxCount) {
      maxCount = data.count;
      mostFrequentLabel = label;
    }
  });

  // Compute label stats
  const labelStats = Array.from(labelCounts.entries()).map(([label, data]) => ({
    label,
    count: data.count,
    avgConfidence: (data.totalConfidence / data.count) * 100,
  }));

  // Sort by count descending
  labelStats.sort((a, b) => b.count - a.count);

  // Count unsure pages
  const unsureCount = pages.filter(
    (page) => page.abstained || page.confidence < 0.5
  ).length;

  return {
    mostFrequentLabel,
    labelStats,
    unsureCount,
  };
}
