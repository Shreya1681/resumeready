"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react"

interface ResumeAnalysis {
  score: number
  skills: string[]
  experience: {
    years: number
    level: string
    companies: string[]
  }
  strengths: string[]
  improvements: string[]
  keywords: string[]
  summary: string
}

export default function UploadPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    // In production, you would use a PDF parsing library like pdf-parse
    // For now, we'll create a mock resume text based on the filename
    // This demonstrates the flow - in real app, use actual PDF parsing
    return `
      John Smith
      Software Engineer
      
      Skills: React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB
      
      Experience:
      - Senior Software Engineer at TechCorp (2021-Present)
        - Led development of microservices architecture
        - Improved system performance by 40%
      
      - Software Engineer at StartupXYZ (2019-2021)
        - Built React frontend applications
        - Implemented CI/CD pipelines
      
      Education:
      - BS Computer Science, State University (2019)
      
      File: ${pdfFile.name}
    `
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setAnalysisError(null)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    setIsUploading(false)
    setIsAnalyzing(true)

    try {
      // Extract text from PDF (mock for demo)
      const resumeText = await extractTextFromPDF(file)
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      
      // Call AI analysis API with user ID
      const response = await fetch(`${apiBase}/api/resume/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, userId: session?.user?.id })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const result = await response.json()
      setAnalysisResult(result)
      
      // Store in localStorage for other pages
      localStorage.setItem('resumeAnalysis', JSON.stringify(result))
      localStorage.setItem('resumeText', resumeText)
      
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      toast.success('Resume analyzed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisError('Failed to analyze resume. Please try again.')
      setIsAnalyzing(false)
      toast.error('Failed to analyze resume')
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setAnalysisResult(null)
    setAnalysisError(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resume</h1>
        <p className="text-muted-foreground">Upload your resume to get AI-powered analysis and skill extraction</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
            <CardDescription>Upload your resume in PDF format</CardDescription>
          </CardHeader>
          <CardContent>
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative rounded-lg border-2 border-dashed p-12 text-center transition-colors
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your resume here</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                  </div>
                  <Badge variant="secondary">PDF files only</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {!isUploading && !isAnalyzing && !analysisComplete && (
                    <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Analyzing State */}
                {isAnalyzing && (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <Sparkles className="h-5 w-5 animate-pulse text-primary" />
                    <div>
                      <p className="font-medium">Analyzing your resume...</p>
                      <p className="text-sm text-muted-foreground">Our AI is extracting skills and insights</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {analysisError && (
                  <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Analysis Failed</p>
                      <p className="text-sm text-muted-foreground">{analysisError}</p>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {analysisComplete && analysisResult && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Analysis Complete!</p>
                        <p className="text-sm text-muted-foreground">Score: {analysisResult.score}/100</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {analysisResult.score}%
                      </Badge>
                    </div>
                    
                    {/* Skills Preview */}
                    <div className="rounded-lg border border-border/50 p-4">
                      <p className="font-medium mb-2">Skills Detected</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.slice(0, 8).map((skill, i) => (
                          <Badge key={i} variant="outline">{skill}</Badge>
                        ))}
                        {analysisResult.skills.length > 8 && (
                          <Badge variant="secondary">+{analysisResult.skills.length - 8} more</Badge>
                        )}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div className="rounded-lg border border-border/50 p-4">
                      <p className="font-medium mb-1">Experience Level</p>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.experience.level} ({analysisResult.experience.years} years)
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!isUploading && !isAnalyzing && !analysisComplete && !analysisError && (
                  <Button onClick={handleUpload} className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    Upload & Analyze
                  </Button>
                )}

                {analysisError && (
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleRemoveFile} className="flex-1">
                      Try Again
                    </Button>
                  </div>
                )}

                {analysisComplete && (
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleRemoveFile} className="flex-1">
                      Upload Another
                    </Button>
                    <Button onClick={() => router.push("/dashboard")} className="flex-1 gap-2">
                      View Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips & Guidelines */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>Tips for the best analysis results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Use PDF Format</p>
                <p className="text-sm text-muted-foreground">PDF files preserve formatting and are easier to analyze</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Clear Text</p>
                <p className="text-sm text-muted-foreground">Ensure your resume has selectable text, not just images</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Include Skills Section</p>
                <p className="text-sm text-muted-foreground">A dedicated skills section helps with better extraction</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">File Size Limit</p>
                <p className="text-sm text-muted-foreground">Maximum file size is 10MB</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium">What we analyze:</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Technical and soft skills</li>
                <li>Work experience relevance</li>
                <li>ATS compatibility score</li>
                <li>Improvement suggestions</li>
                <li>Company matching potential</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
