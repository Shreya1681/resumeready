"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Award,
  ArrowRight,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"

interface ResumeData {
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

interface InterviewSession {
  _id: string
  overallScore: number
  questions: string[]
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [interviews, setInterviews] = useState<InterviewSession[]>([])

  const loadDashboardData = async (userId: string) => {
    try {
      // 1. Load active resume
      const resumeRes = await fetch(`http://localhost:5000/api/resume/active?userId=${userId}`)
      if (resumeRes.ok) {
        const resumeData = await resumeRes.json()
        setResume(resumeData)
      } else {
        // Fallback to localStorage
        const localResume = localStorage.getItem("resumeAnalysis")
        if (localResume) {
          setResume(JSON.parse(localResume))
        }
      }

      // 2. Load interview history
      const historyRes = await fetch(`http://localhost:5000/api/interview/history?userId=${userId}`)
      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setInterviews(historyData)
      }
    } catch (err) {
      console.error("Dashboard load data error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    loadDashboardData(session.user.id)
  }, [session])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading Dashboard Data...</h2>
          <p className="text-sm text-muted-foreground mt-1">Connecting to MongoDB Atlas...</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const resumeScore = resume ? resume.score : 0
  const interviewsCount = interviews.length
  
  const averageScore = interviewsCount > 0 
    ? Math.round(interviews.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewsCount) 
    : 0

  const skillsList = resume && resume.skills.length > 0 
    ? resume.skills 
    : ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "PostgreSQL", "REST APIs", "Git", "CI/CD", "Agile"]

  const recentInterviews = interviews.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name || "Candidate"}! Here&apos;s your interview preparation progress.</p>
        </div>
        <Link href="/interview">
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Start Mock Interview
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Resume Score Card */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resume ATS Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumeScore > 0 ? `${resumeScore}/100` : "No Resume"}</div>
            {resumeScore > 0 ? (
              <>
                <Progress value={resumeScore} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">Parsed: {resume.experience?.level || "N/A"}</p>
              </>
            ) : (
              <>
                <Progress value={0} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">Upload resume to analyze ATS score</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Interviews Completed Card */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewsCount}</div>
            <p className="mt-2 text-xs text-muted-foreground">Recorded in your profile</p>
          </CardContent>
        </Card>

        {/* Average Score Card */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average AI Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore > 0 ? `${averageScore}%` : "0%"}</div>
            <p className="mt-2 text-xs text-primary">{interviewsCount > 0 ? "Targeting 85% for FAANG" : "Start interviews to get evaluated"}</p>
          </CardContent>
        </Card>

        {/* Skills Matched Card */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Extracted Skills</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resume ? resume.skills.length : 0}</div>
            <p className="mt-2 text-xs text-muted-foreground">Extracted from latest upload</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Extracted Skills */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Extracted Skills
            </CardTitle>
            <CardDescription>{resume ? "Skills identified from your resume" : "Default technical catalog (upload resume to update)"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/upload">
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  {resume ? "Update Resume" : "Upload Resume"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Interview Progress */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Practice Sessions
            </CardTitle>
            <CardDescription>Your mock interview records in MongoDB Atlas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((session, index) => (
                <div key={session._id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      session.overallScore >= 90 ? 'bg-primary/20 text-primary' :
                      session.overallScore >= 80 ? 'bg-chart-2/20 text-chart-2' :
                      'bg-chart-5/20 text-chart-5'
                    }`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Mock Session {interviews.length - index}</p>
                      <p className="text-xs text-muted-foreground">{session.questions.length} questions answered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{session.overallScore}%</p>
                    <p className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border/60 rounded-lg">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs font-semibold text-muted-foreground">No sessions recorded yet</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Start your first technical interview session</p>
              </div>
            )}
            {interviewsCount > 0 && (
              <Link href="/results" className="block pt-2">
                <Button variant="outline" className="w-full gap-2">
                  View Full Diagnostics
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Interactive Tools</CardTitle>
          <CardDescription>Speed up your interview prep with targeted modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/upload" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Resume ATS Check</p>
                  <p className="text-xs text-muted-foreground">Optimize keywords</p>
                </div>
              </div>
            </Link>
            <Link href="/interview" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">AI Interview Room</p>
                  <p className="text-xs text-muted-foreground">Real-time mock runs</p>
                </div>
              </div>
            </Link>
            <Link href="/companies" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">FAANG Company Prep</p>
                  <p className="text-xs text-muted-foreground">Real interview questions</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
