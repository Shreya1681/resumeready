"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  TrendingUp, 
  Target,
  Award,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Download,
  Share2,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Loader2,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts"

interface QuestionFeedback {
  question: string
  score: number
  feedback: string
  suggestions: string
}

interface InterviewResult {
  _id: string
  questions: string[]
  answers: string[]
  overallScore: number
  technicalScore: number
  communicationScore: number
  problemSolvingScore: number
  strengths: string[]
  improvements: string[]
  questionFeedback: QuestionFeedback[]
  overallFeedback: string
  nextSteps: string[]
  timeSpent: number
  createdAt: string
}

export default function ResultsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)
  const [history, setHistory] = useState<InterviewResult[]>([])
  const [selectedResult, setSelectedResult] = useState<InterviewResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/interview/history?userId=${userId}`)
      if (!res.ok) throw new Error("Failed to fetch interview history")
      const data = await res.json()
      setHistory(data)
      if (data.length > 0) {
        setSelectedResult(data[0])
      }
      return data
    } catch (err: any) {
      console.error(err)
      setError("Failed to load interview records.")
      return []
    }
  }

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    const init = async () => {
      setLoading(true)
      const userId = session.user.id
      
      // 1. Fetch existing history from MongoDB
      const existingHistory = await fetchHistory(userId)
      
      // 2. Check if we have a pending interview transcript in localStorage to evaluate
      const localQuestionsRaw = localStorage.getItem("interviewQuestions")
      const localAnswersRaw = localStorage.getItem("interviewAnswers")
      const localTimeRaw = localStorage.getItem("interviewTime")
      
      if (localQuestionsRaw && localAnswersRaw) {
        try {
          const questions = JSON.parse(localQuestionsRaw)
          const answers = JSON.parse(localAnswersRaw)
          const timeSpent = localTimeRaw ? parseInt(localTimeRaw, 10) : 0
          
          // Clear localStorage so we don't evaluate it again on next refresh
          localStorage.removeItem("interviewQuestions")
          localStorage.removeItem("interviewAnswers")
          localStorage.removeItem("interviewTime")
          
          setEvaluating(true)
          toast.info("New interview transcript found! Evaluating with Gemini AI...")
          
          // Trigger evaluation
          const evalRes = await fetch("http://localhost:5000/api/interview/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questions,
              answers,
              userId,
              timeSpent,
              resumeContext: localStorage.getItem("resumeText") || ""
            })
          })
          
          if (!evalRes.ok) {
            throw new Error("Evaluation request failed")
          }
          
          toast.success("AI Evaluation complete!")
          // Refresh history and set active result to the new session
          await fetchHistory(userId)
        } catch (err: any) {
          console.error("Evaluation error:", err)
          toast.error("Failed to analyze your interview. Loading previous sessions instead.")
        } finally {
          setEvaluating(false)
        }
      }
      
      setLoading(false)
    }

    init()
  }, [session])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading Interview Results...</h2>
          <p className="text-sm text-muted-foreground mt-1">Retrieving details from your MongoDB Atlas database.</p>
        </div>
      </div>
    )
  }

  if (evaluating) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <Loader2 className="absolute h-20 w-20 animate-spin text-primary/30" style={{ animationDuration: '3s' }} />
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight">Gemini AI is Reviewing Your Interview</h2>
          <p className="text-sm text-muted-foreground">
            We are analyzing your communication style, coding logic, and question-by-question technical accuracy. This will take a few seconds...
          </p>
          <Progress value={75} className="h-1.5 w-64 mx-auto mt-4 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="max-w-md border-border/50 text-center p-8">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your personalized mock interview results and track progress.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="max-w-lg border-border/50 text-center p-8">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">No Interview Data Yet</CardTitle>
              <CardDescription>
                You haven&apos;t completed any mock interviews yet. Start a real-time interview with our AI coach to receive custom metrics.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Link href="/interview" className="block">
              <Button className="w-full h-11 gap-2">
                Start AI Mock Interview
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const result = selectedResult || history[0]

  // Recharts Progress Data
  const progressData = [...history]
    .reverse()
    .map((item, index) => ({
      interview: `Session ${index + 1}`,
      score: item.overallScore
    }))

  const strengthsData = [
    { name: "Technical", value: result.technicalScore },
    { name: "Communication", value: result.communicationScore },
    { name: "Problem Solving", value: result.problemSolvingScore },
  ]

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

  const categoryScores = [
    { category: "Technical Skills", score: result.technicalScore },
    { category: "Communication Clarity", score: result.communicationScore },
    { category: "Problem Solving", score: result.problemSolvingScore },
  ]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeSpent = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return mins > 0 ? `${mins}m ${remainingSecs}s` : `${remainingSecs}s`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
          <p className="text-muted-foreground text-sm">Real-time evaluations stored in MongoDB Atlas</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button variant="outline" size="sm" onClick={() => fetchHistory(session.user.id)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Sidebar: Session List */}
        <Card className="border-border/50 lg:col-span-1 h-fit">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-semibold">History Sessions</CardTitle>
            <CardDescription className="text-xs">Switch between mock attempts</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 px-2">
            <div className="space-y-1">
              {history.map((item, index) => {
                const isActive = result._id === item._id
                return (
                  <button
                    key={item._id}
                    onClick={() => setSelectedResult(item)}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors text-xs ${
                      isActive 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold flex items-center gap-1">
                        Session {history.length - index}
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${isActive ? 'text-primary-foreground border-primary-foreground' : ''}`}>
                          {item.overallScore}%
                        </Badge>
                      </p>
                      <p className="text-[10px] opacity-80 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Area: Results Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Overall Score Card */}
          <Card className="border-border/50 overflow-hidden shadow-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
              <CardContent className="relative p-6 md:p-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                  <div className="text-center md:text-left space-y-2">
                    <span className="text-xs font-semibold tracking-wider uppercase text-primary">Performance Evaluation</span>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                      <span className="text-6xl font-extrabold tracking-tight">{result.overallScore}</span>
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatDate(result.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        Duration: {formatTimeSpent(result.timeSpent)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="text-center bg-card/60 backdrop-blur border border-border/40 rounded-xl p-4 min-w-[100px]">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-foreground">Top 15%</p>
                      <p className="text-[10px] text-muted-foreground">Global Rank</p>
                    </div>
                    <div className="text-center bg-card/60 backdrop-blur border border-border/40 rounded-xl p-4 min-w-[100px]">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/15">
                        <Award className="h-5 w-5 text-chart-2" />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-foreground">
                        {result.overallScore >= 80 ? "Verified" : "Needs Practice"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Status</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Performance Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Skill Categories
                </CardTitle>
                <CardDescription className="text-xs">Your graded scores across different aspects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryScores.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.category}</span>
                      <span className="font-semibold text-primary">{cat.score}%</span>
                    </div>
                    <Progress value={cat.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Overall Progress
                </CardTitle>
                <CardDescription className="text-xs">Score progression across mock sessions</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {progressData.length <= 1 ? (
                  <div className="text-center text-xs text-muted-foreground p-8">
                    Complete more mock sessions to generate a progress chart.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="interview" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Overall Coach Feedback */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                AI Coach Evaluation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm leading-relaxed text-foreground">
              {result.overallFeedback || "No feedback summary generated."}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {result.strengths && result.strengths.length > 0 ? (
                  result.strengths.map((str, idx) => (
                    <div key={idx} className="flex gap-2 text-xs bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                      <span className="font-bold text-emerald-500">{idx + 1}.</span>
                      <p className="text-muted-foreground"><strong className="text-foreground">{str.split(':')[0]}</strong>{str.includes(':') ? str.split(':').slice(1).join(':') : ''}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No strengths recorded.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-500">
                  <AlertCircle className="h-4.5 w-4.5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {result.improvements && result.improvements.length > 0 ? (
                  result.improvements.map((imp, idx) => (
                    <div key={idx} className="flex gap-2 text-xs bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                      <span className="font-bold text-amber-500">{idx + 1}.</span>
                      <p className="text-muted-foreground"><strong className="text-foreground">{imp.split(':')[0]}</strong>{imp.includes(':') ? imp.split(':').slice(1).join(':') : ''}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No areas to improve recorded.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Q&A Feedback */}
          <Card className="border-border/50">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Question-by-Question Diagnostics
              </CardTitle>
              <CardDescription className="text-xs">Detailed response rating and structural guidance</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                  <TabsTrigger value="all" className="text-xs">All Questions</TabsTrigger>
                  <TabsTrigger value="strong" className="text-xs">Strong (80%+)</TabsTrigger>
                  <TabsTrigger value="improve" className="text-xs">Needs Work (&lt;80%)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {result.questionFeedback.map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-primary">Q{idx + 1}: Technical Query</p>
                          <p className="font-medium text-sm text-foreground">{item.question}</p>
                        </div>
                        <Badge variant={item.score >= 80 ? "default" : "secondary"} className="shrink-0 text-xs">
                          {item.score}%
                        </Badge>
                      </div>
                      
                      {result.answers[idx] && (
                        <div className="rounded bg-muted/40 p-2.5 text-xs text-muted-foreground border-l-2 border-border">
                          <span className="font-semibold text-foreground block mb-0.5">Your response:</span>
                          &ldquo;{result.answers[idx]}&rdquo;
                        </div>
                      )}

                      <div className="text-xs space-y-2 pt-1 border-t border-border/40">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground block mb-0.5 font-semibold">Evaluation:</strong>
                          {item.feedback}
                        </p>
                        {item.suggestions && (
                          <p className="text-muted-foreground">
                            <strong className="text-foreground block mb-0.5 font-semibold">Actionable Tip:</strong>
                            {item.suggestions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="strong" className="space-y-4 mt-4">
                  {result.questionFeedback.filter(f => f.score >= 80).map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-medium text-sm text-foreground">{item.question}</p>
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">{item.score}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.feedback}</p>
                    </div>
                  ))}
                  {result.questionFeedback.filter(f => f.score >= 80).length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-6">No answers scored above 80% in this session.</div>
                  )}
                </TabsContent>

                <TabsContent value="improve" className="space-y-4 mt-4">
                  {result.questionFeedback.filter(f => f.score < 80).map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-medium text-sm text-foreground">{item.question}</p>
                        <Badge className="bg-amber-500 text-white hover:bg-amber-600">{item.score}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.feedback}</p>
                      {item.suggestions && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">💡 Tip: {item.suggestions}</p>
                      )}
                    </div>
                  ))}
                  {result.questionFeedback.filter(f => f.score < 80).length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-6">Perfect run! All answers scored above 80%.</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actionable Next Steps */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Preparation Action Items
              </CardTitle>
              <CardDescription className="text-xs">Follow this checklist before your next live interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {result.nextSteps && result.nextSteps.length > 0 ? (
                  result.nextSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-muted-foreground">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground col-span-2">No recommended next steps available.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-2">
            <Link href="/interview">
              <Button className="w-full sm:w-auto gap-2">
                <RefreshCw className="h-4 w-4" />
                Practice Another Mock Session
              </Button>
            </Link>
            <Link href="/companies">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Target className="h-4 w-4" />
                Target Company-Specific Prep
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                Back to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
