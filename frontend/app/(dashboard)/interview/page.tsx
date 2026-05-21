"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { toast } from "sonner"
import { 
  Mic, 
  MicOff, 
  Send, 
  ChevronRight, 
  Monitor,
  MonitorOff,
  Video,
  VideoOff,
  Clock,
  Sparkles,
  MessageSquare,
  User,
  Play,
  Square,
  AlertTriangle,
  Timer,
  Camera,
  ScreenShare,
  Loader2,
  Activity,
  HeartPulse,
  BrainCircuit,
  MessageCircleQuestion
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const TOTAL_TIME_LIMIT = 30 * 60 // 30 minutes total
const RECOMMENDED_TURNS = 5 // Recommended turns for completion

export default function InterviewPage() {
  const router = useRouter()
  const [currentTurn, setCurrentTurn] = useState(0)
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(TOTAL_TIME_LIMIT)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [permissionError, setPermissionError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenVideoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // AI Chat integration
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/interview/chat' }),
  })

  const isStreaming = status === 'streaming'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Total Time Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInterviewStarted && totalTimeRemaining > 0) {
      interval = setInterval(() => {
        setTotalTimeRemaining(prev => {
          if (prev <= 1) {
            endInterview()
            return 0
          }
          return prev - 1
        })
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInterviewStarted, totalTimeRemaining])

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [videoStream, screenStream])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = (timeRemaining: number) => {
    if (timeRemaining <= 60) return 'text-destructive'
    if (timeRemaining <= 300) return 'text-chart-3'
    return 'text-foreground'
  }

  const getTimerBgColor = (timeRemaining: number) => {
    if (timeRemaining <= 60) return 'bg-destructive/10 border-destructive/50'
    if (timeRemaining <= 300) return 'bg-chart-3/10 border-chart-3/50'
    return 'bg-muted/50 border-border'
  }

  const startInterview = async () => {
    setIsInterviewStarted(true)
    // Dynamic starting trigger
    await sendMessage({ 
      text: "Let's start the dynamic technical mock interview! Please welcome me, briefly introduce yourself as an AI Technical Interviewer, and ask me the first question to assess my software engineering capabilities. Ask one question at a time and wait for my response." 
    })
  }

  // Extract text from message parts helper
  const getMessageText = (msg: any) => {
    if (!msg.parts || !Array.isArray(msg.parts)) {
      return msg.content || ""
    }
    return msg.parts
      .filter((p: any): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p: any) => p.text)
      .join('')
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isStreaming) return

    const currentAnswer = answer
    setUserAnswers(prev => [...prev, currentAnswer])
    setAnswer("")
    setCurrentTurn(prev => prev + 1)

    // Send answer to AI for follow-up and next question
    await sendMessage({ 
      text: currentAnswer 
    })
  }

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      toast.info("Voice recording stopped")
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsRecording(true)
        toast.success("Voice recording started")
      } catch (err: any) {
        console.warn("Microphone permission info:", err)
        const errName = err?.name || ""
        if (errName === "NotAllowedError" || errName === "PermissionDeniedError" || errName === "NotFoundError") {
          toast.info("Microphone access was cancelled or denied.")
        } else {
          toast.error("Microphone access failed. Please check your browser settings.")
        }
      }
    }
  }

  const toggleVideo = async () => {
    if (isVideoOn) {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
        setVideoStream(null)
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setIsVideoOn(false)
      setPermissionError(null)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          } 
        })
        setVideoStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setIsVideoOn(true)
        setPermissionError(null)
        toast.success("Camera enabled")
      } catch (err: any) {
        console.warn("Camera permission info:", err)
        const errName = err?.name || ""
        if (errName === "NotAllowedError" || errName === "PermissionDeniedError" || errName === "NotFoundError") {
          toast.info("Camera access was cancelled or denied.")
        } else {
          setPermissionError("Could not access camera. Please verify it is connected and not in use by another app.")
          toast.error("Camera access failed.")
        }
      }
    }
  }

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop())
        setScreenStream(null)
      }
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null
      }
      setIsScreenSharing(false)
      setPermissionError(null)
    } else {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          throw new Error('Screen sharing is not supported in this browser')
        }

        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "monitor",
          },
          audio: false
        })
        
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream
          await screenVideoRef.current.play()
        }
        setScreenStream(stream)
        setIsScreenSharing(true)
        setPermissionError(null)
        toast.success("Screen sharing started")

        // Handle when user stops sharing via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          setScreenStream(null)
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = null
          }
          toast.info("Screen sharing stopped")
        }
      } catch (err: any) {
        console.warn("Screen sharing permission info:", err)
        const errName = err?.name || ""
        const errMsg = err?.message || ""
        
        // If user cancelled the picker
        if (errName === "NotAllowedError" && (errMsg.includes("denied") || errMsg.includes("cancel") || errMsg.includes("Permission") || errMsg.includes("user"))) {
          toast.info("Screen sharing cancelled by user")
          return
        }
        
        // If blocked by iframe sandbox or lack of secure context
        if (errName === "SecurityError" || errMsg.includes("sandbox") || errMsg.includes("not allowed")) {
          setPermissionError("Screen sharing is restricted in this preview sandbox. Please open http://localhost:3000 in a direct browser tab to enable screen sharing.")
          toast.error("Screen sharing blocked by browser sandbox.")
        } else {
          setPermissionError("Screen sharing was cancelled or denied.")
          toast.info("Screen sharing cancelled")
        }
      }
    }
  }, [isScreenSharing, screenStream])

  const endInterview = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop())
    }
    
    // Extract dynamic questions & answers from transcript
    const questionsList = messages
      .filter(m => m.role === 'assistant')
      .map(m => getMessageText(m))
    const answersList = messages
      .filter(m => m.role === 'user')
      .map(m => getMessageText(m))

    // Save actual conversation logs
    localStorage.setItem('interviewAnswers', JSON.stringify(answersList.length > 0 ? answersList : ["Interview completed."]))
    localStorage.setItem('interviewQuestions', JSON.stringify(questionsList.length > 0 ? questionsList : ["General technical discussion."]))
    localStorage.setItem('interviewTime', elapsedTime.toString())
    
    router.push("/results")
  }, [screenStream, videoStream, messages, elapsedTime, router])

  const progress = Math.min((currentTurn / RECOMMENDED_TURNS) * 100, 100)

  // Get active coaching tips based on conversation length
  const getCoachingTip = () => {
    if (currentTurn === 0) return "Introduce yourself clearly and explain your programming background."
    if (currentTurn === 1) return "Outline the technical constraints first before coding your solution."
    if (currentTurn === 2) return "Explain the trade-offs of your choices (e.g., time/space complexity)."
    if (currentTurn === 3) return "Discuss edge cases and how you would catch unexpected errors."
    return "Structure your summary using the STAR format (Situation, Task, Action, Result)."
  }

  if (!isInterviewStarted) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="max-w-lg border-border/50 bg-card/70 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">AI Conversational Mock Interview</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Interact with our real-time AI expert interviewer. Speak or type naturally; the AI adapts, asks follow-ups, and probes technical depths dynamically!
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/40 border border-border/50 p-5 space-y-3 text-sm">
              <p className="font-semibold text-foreground">💡 How the interactive flow works:</p>
              <ul className="space-y-2.5 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Zero Pre-made Answers</strong>: The AI decides the interview direction based on your input.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Real-time follow-ups</strong>: The AI will probe your technical code structure and communication style.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mic className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Full media tools</strong>: Utilize camera sharing, voice records, and screen shares dynamically.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Recommended session</strong>: The ideal interview flow consists of 5 interactive turns.</span>
                </li>
              </ul>
            </div>
            <Button onClick={startInterview} className="w-full h-11 gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all">
              <Play className="h-4 w-4 fill-current" />
              Begin Real-Time Session
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Interactive AI Interview</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            Live Session Turn: {currentTurn + 1}
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Progress badge */}
          <Badge variant="secondary" className="px-2.5 py-1 text-xs">
            {currentTurn >= RECOMMENDED_TURNS ? "Ready for Results" : "Interview in Progress"}
          </Badge>
          {/* Total Timer */}
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${getTimerBgColor(totalTimeRemaining)}`}>
            <Clock className={`h-4 w-4 ${getTimerColor(totalTimeRemaining)}`} />
            <span className={`font-mono font-medium ${getTimerColor(totalTimeRemaining)}`}>
              {formatTime(totalTimeRemaining)}
            </span>
          </div>
          <Button variant="destructive" size="sm" onClick={endInterview} className="shadow-sm active:scale-[0.98]">
            <Square className="mr-2 h-4 w-4 fill-current" />
            End Session
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Session progress target</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Real-Time Session Metrics Dashboard */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Interviewer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">AI Lead Engineer</h3>
                  <p className="text-xs text-muted-foreground">Full-Stack Specialist</p>
                </div>
              </div>
              <div className="space-y-1.5 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Focus:</span>
                  <span className="font-medium text-foreground">React, Web & System Design</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-primary flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    Listening
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-chart-2" />
                Real-Time Audio Input
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-center space-y-4">
              {isRecording ? (
                <div className="flex justify-center items-center gap-1 h-12">
                  <span className="h-6 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <span className="h-10 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <span className="h-8 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="h-11 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <span className="h-5 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <span className="h-7 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <span className="h-9 w-1 bg-primary rounded animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              ) : (
                <div className="flex justify-center items-center border border-dashed border-border/80 rounded-lg p-5 text-xs text-muted-foreground">
                  Voice input disabled. Toggle the microphone button to dictate your answer.
                </div>
              )}
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className="w-full gap-2 text-xs font-medium"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Voice Input
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Enable Voice Input
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-chart-3" />
                Live Coach Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground leading-relaxed italic bg-chart-3/5 border border-chart-3/20 rounded-lg p-3">
                "{getCoachingTip()}"
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Chat Dialog & Answer Panel */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Real-Time Interview Room</CardTitle>
                <CardDescription>Zero pre-made answers. Speak naturally to communicate your technical skills.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isVideoOn ? "default" : "outline"}
                  size="icon"
                  onClick={toggleVideo}
                  title={isVideoOn ? "Turn off camera" : "Turn on camera"}
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="icon"
                  onClick={toggleScreenShare}
                  title={isScreenSharing ? "Stop sharing" : "Share screen"}
                >
                  {isScreenSharing ? <Monitor className="h-4 w-4" /> : <MonitorOff className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Media Overlays */}
              {(isVideoOn || isScreenSharing) && (
                <div className="flex gap-4 animate-fade-in-up">
                  {isVideoOn && (
                    <div className="relative aspect-video w-40 overflow-hidden rounded-xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg p-[1px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
                      <div className="h-full w-full overflow-hidden rounded-xl">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full scale-x-[-1] object-cover"
                        />
                      </div>
                      <span className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground flex items-center gap-1 shadow-sm border border-border/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Candidate (You)
                      </span>
                    </div>
                  )}
                  {isScreenSharing && (
                    <div className="relative aspect-video flex-grow overflow-hidden rounded-xl border border-primary/40 bg-card/60 backdrop-blur-md shadow-lg p-[1px] bg-gradient-to-tr from-indigo-500/30 to-purple-500/30">
                      <div className="h-full w-full overflow-hidden rounded-xl">
                        <video
                          ref={screenVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-primary/95 px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
                        <Monitor className="h-3 w-3 animate-pulse" />
                        Screen Sharing
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Area */}
              <ScrollArea className="h-[340px] rounded-xl border border-border/40 bg-muted/10 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <span className="text-sm font-medium">Entering interactive chat room...</span>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`flex gap-3 animate-fade-in-up ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                         message.role === 'assistant' 
                           ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-primary' 
                           : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                      }`}>
                        {message.role === 'assistant' ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className={`max-w-[80%] px-4 py-2.5 leading-relaxed ${
                        message.role === 'assistant' 
                          ? 'bg-card/90 border border-indigo-500/10 text-foreground text-sm rounded-2xl rounded-tl-none shadow-sm shadow-indigo-500/5' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-primary-foreground text-sm rounded-2xl rounded-tr-none shadow-md shadow-indigo-500/10'
                      }`}>
                        <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
                        {status === 'streaming' && index === messages.length - 1 && message.role === 'assistant' && (
                          <span className="inline-block w-2.5 h-4 ml-1 bg-primary animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Answer Input Panel */}
              <div className="space-y-3">
                <Textarea
                  placeholder={isStreaming ? "AI Interviewer is writing, please listen or wait..." : "Type your technical answer here..."}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[110px] resize-none border-border/80 focus-visible:ring-primary text-sm p-3.5"
                  disabled={isStreaming}
                />
                
                {currentTurn >= RECOMMENDED_TURNS && (
                  <div className="flex items-center gap-2 rounded-lg border border-chart-2/30 bg-chart-2/5 p-3 text-xs text-chart-2 font-medium">
                    <Sparkles className="h-4 w-4 shrink-0 animate-bounce" />
                    You have successfully completed 5 technical turns! You can continue chatting or click End Session at the top to generate your metrics!
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!answer.trim() || isStreaming}
                    className="h-10 px-5 shadow-sm font-medium active:scale-[0.98] transition-all"
                  >
                    {isStreaming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
