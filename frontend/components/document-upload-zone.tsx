'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UploadedDocument } from '@/lib/types'

interface DocumentUploadZoneProps {
  onDocumentsReady: (resume: UploadedDocument, jobDescription: UploadedDocument) => void
  isAnalyzing: boolean
}

interface DropZoneProps {
  type: 'resume' | 'job-description'
  file: UploadedDocument | null
  onFileUpload: (file: UploadedDocument) => void
  onFileRemove: () => void
}

function DropZone({ type, file, onFileUpload, onFileRemove }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback(async (uploadedFile: File) => {
    const text = await uploadedFile.text()
    const document: UploadedDocument = {
      name: uploadedFile.name,
      type,
      content: text,
      uploadedAt: new Date(),
    }
    onFileUpload(document)
  }, [type, onFileUpload])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const uploadedFile = e.dataTransfer.files[0]
    if (uploadedFile) {
      await processFile(uploadedFile)
    }
  }, [processFile])

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      await processFile(uploadedFile)
    }
  }, [processFile])

  const title = type === 'resume' ? 'Resume / CV' : 'Job Description'
  const description = type === 'resume' 
    ? 'Upload the candidate\'s resume to analyze their skills and experience'
    : 'Upload the target role\'s job description to identify required skills'

  return (
    <Card className={cn(
      'relative transition-all duration-300',
      isDragging && 'ring-2 ring-primary border-primary',
      file && 'border-accent'
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {file ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
          )}
          {title}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-md">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {file.uploadedAt.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFileRemove}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
              'hover:border-primary hover:bg-primary/5',
              isDragging && 'border-primary bg-primary/10'
            )}
          >
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id={`file-${type}`}
            />
            <label htmlFor={`file-${type}`} className="cursor-pointer">
              <Upload className={cn(
                'h-10 w-10 mx-auto mb-3 transition-colors',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )} />
              <p className="text-sm font-medium">
                Drop your file here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports TXT, PDF, DOC, DOCX
              </p>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DocumentUploadZone({ onDocumentsReady, isAnalyzing }: DocumentUploadZoneProps) {
  const [resume, setResume] = useState<UploadedDocument | null>(null)
  const [jobDescription, setJobDescription] = useState<UploadedDocument | null>(null)

  const canAnalyze = resume && jobDescription && !isAnalyzing

  const handleAnalyze = () => {
    if (resume && jobDescription) {
      onDocumentsReady(resume, jobDescription)
    }
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Document Upload</h2>
        <p className="text-muted-foreground">
          Upload both documents to begin the intelligent skill analysis
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <DropZone
          type="resume"
          file={resume}
          onFileUpload={setResume}
          onFileRemove={() => setResume(null)}
        />
        <DropZone
          type="job-description"
          file={jobDescription}
          onFileUpload={setJobDescription}
          onFileRemove={() => setJobDescription(null)}
        />
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="px-8"
        >
          {isAnalyzing ? (
            <>
              <span className="animate-pulse">Analyzing Documents...</span>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Analyze & Generate Roadmap
            </>
          )}
        </Button>
      </div>
    </section>
  )
}
