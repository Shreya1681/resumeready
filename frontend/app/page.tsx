import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { 
  FileText, 
  Mic, 
  BarChart3, 
  Building2, 
  Upload, 
  Brain, 
  Target, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Monitor,
  Check,
  TrendingUp,
  BrainCircuit,
  Award
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden bg-grid-pattern">
      {/* Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }} />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary font-medium shadow-sm animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Unlocking FAANG Career Prep with Gemini 2.5</span>
            </div>
            
            <h1 className="text-balance text-5xl font-extrabold tracking-tight md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 leading-tight animate-fade-in-up">
              Ace Your Technical Interviews with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">AI Guidance</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-pretty text-base md:text-lg text-muted-foreground md:leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Upload your resume for real-time ATS optimization, extract critical skills, and practice speech-enabled technical coding mock interviews tailored to top tech companies.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/upload">
                <Button size="lg" className="h-12 px-6 gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Upload className="h-4.5 w-4.5" />
                  Analyze Resume
                </Button>
              </Link>
              <Link href="/interview">
                <Button size="lg" variant="outline" className="h-12 px-6 gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Mic className="h-4.5 w-4.5" />
                  Start Mock Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive UI Mockup Showcase */}
          <div className="mt-16 md:mt-24 mx-auto max-w-5xl rounded-xl border border-border/60 bg-card/45 backdrop-blur-md p-3 md:p-4 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-lg border border-border/40 bg-background/80 overflow-hidden shadow-inner grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
              {/* Mock ATS panel */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">ATS Score Card</span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5">Match High</Badge>
                </div>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-extrabold text-foreground">89</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <Progress value={89} className="h-1.5" />
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Extracted 14 core tech skills</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Keyword optimization updated</span>
                  </div>
                </div>
              </div>

              {/* Mock AI Interview chat */}
              <div className="p-6 md:col-span-2 space-y-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold text-foreground">Live AI Technical Mock Room</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Turn 3/5</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">AI</div>
                    <div className="bg-card border border-border/40 rounded-lg p-2.5 text-xs text-muted-foreground max-w-[85%] leading-relaxed">
                      How would you implement an LRU cache in Node? What data structures would you combine to get O(1) reads and writes?
                    </div>
                  </div>
                  <div className="flex gap-2 flex-row-reverse">
                    <div className="h-6 w-6 rounded-full bg-muted border flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">You</div>
                    <div className="bg-primary text-primary-foreground rounded-lg p-2.5 text-xs max-w-[85%] leading-relaxed">
                      I would combine a Doubly Linked List with a Hash Map. The Hash Map provides O(1) access to cache nodes...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/10 py-20">
        <div className="container space-y-16">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Engineered for Candidate Success
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              A comprehensive toolbelt powered by Gemini to help you stand out and land the offer.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:scale-[1.01] transition-all shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base font-bold">Resume Analysis</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Complete parsing and ATS compatibility score matching your target roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Skill extraction & matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    ATS compatibility scores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Keyword suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:scale-[1.01] transition-all shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <BrainCircuit className="h-5 w-5 text-indigo-500" />
                </div>
                <CardTitle className="text-base font-bold">Conversational AI Mock</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Real-time adaptive interviewer simulating structural engineering questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                    Voice response dictation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                    Real-time adaptive follow-ups
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                    Streaming AI questions
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:scale-[1.01] transition-all shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                  <Monitor className="h-5 w-5 text-pink-500" />
                </div>
                <CardTitle className="text-base font-bold">Mock Screen Share</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Optionally share screen layouts to explain visual coding or architecture maps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-pink-500" />
                    Visual browser shares
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-pink-500" />
                    Camera overlay frame
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-pink-500" />
                    Interactive environment
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:scale-[1.01] transition-all shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                </div>
                <CardTitle className="text-base font-bold">FAANG Specific Prep</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Structured questions and tips compiled for Google, Meta, Microsoft, and Amazon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Leadership principle tips
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Company difficulty indexes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Targeted practice rounds
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:scale-[1.01] transition-all shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-base font-bold">Performance Analytics</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Track statistics over time using dynamic charts linked to MongoDB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                    Category score breakdowns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                    Historical session curves
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                    Detailed diagnostics
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:scale-[1.01] transition-all shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                  <Target className="h-5 w-5 text-rose-500" />
                </div>
                <CardTitle className="text-base font-bold">Actionable Guidance</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Checklists, STAR story tips, and strengths indicators built for developers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500" />
                    Specific STAR templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500" />
                    Concrete improvement steps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500" />
                    Mock timeline checklist
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl border border-border/40 p-8 md:p-16 shadow-lg bg-card/30 backdrop-blur">
            <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
            <div className="relative mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Ace Your Next Interview?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Join thousands of candidates using AI mock simulations to land software engineering offers. Create your profile and start preparing today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-muted/5 relative z-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold">ResumeAI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ResumeAI. Designed for tech candidates globally.
          </p>
        </div>
      </footer>
    </div>
  )
}
