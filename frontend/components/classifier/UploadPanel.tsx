"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadPanelProps {
  onFileSelect: (file: File) => void;
  onClassify: () => void;
  isLoading: boolean;
  selectedFile: File | null;
}

export function UploadPanel({
  onFileSelect,
  onClassify,
  isLoading,
  selectedFile,
}: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setValidationError(null);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValidationError(null);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleClassifyClick = () => {
    if (!selectedFile) {
      setValidationError("Please upload an image first.");
      return;
    }
    setValidationError(null);
    onClassify();
  };

  const handleReplaceFile = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFileSelect(null as any);
    setValidationError(null);
  };

  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Upload Document</CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload an image to classify its document type.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border/50 hover:border-primary/50 hover:bg-accent/30"
          )}
        >
          <Upload
            className={cn(
              "mb-4 h-12 w-12 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <div className="mb-2 text-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="font-medium text-primary hover:text-primary/80 transition-colors">
                Choose a file
              </span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="sr-only"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, JPEG up to 10MB
          </p>
        </div>

        {/* File Pill */}
        {selectedFile && (
          <div className="rounded-xl border border-border bg-accent/20 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleReplaceFile}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Replace file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Classify Button */}
        <div className="space-y-2">
          <Button
            onClick={handleClassifyClick}
            disabled={isLoading}
            className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="mr-2">Classifying</span>
                <span className="inline-block animate-pulse">...</span>
              </>
            ) : (
              "Classify Document"
            )}
          </Button>
          {validationError && (
            <p className="text-sm text-destructive text-center">
              {validationError}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
