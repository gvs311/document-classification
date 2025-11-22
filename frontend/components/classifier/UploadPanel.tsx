"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface UploadPanelProps {
  onFileSelect: (file: File) => void
  onClassify: () => void
  isLoading: boolean
  selectedFile: File | null
}

export function UploadPanel({ onFileSelect, onClassify, isLoading, selectedFile }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>Upload an image to classify its document type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
          )}
        >
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <div className="mb-2 text-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="font-medium text-primary hover:text-primary/80">Choose a file</span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileInput} className="sr-only" />
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
        </div>

        {selectedFile && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={onClassify} disabled={!selectedFile || isLoading} className="w-full" size="lg">
          {isLoading ? "Classifying..." : "Classify Document"}
        </Button>
      </CardContent>
    </Card>
  )
}
