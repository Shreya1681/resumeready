"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Building2, 
  ChevronRight, 
  Code, 
  Users, 
  TrendingUp,
  Clock,
  Star,
  BookOpen,
  Lightbulb,
  ArrowRight
} from "lucide-react"

const companies = [
  {
    id: "google",
    name: "Google",
    logo: "G",
    color: "bg-blue-500",
    description: "Search & Cloud Computing Giant",
    difficulty: "Hard",
    avgSalary: "$180k - $350k",
    interviewRounds: 5,
    requiredSkills: ["Data Structures", "Algorithms", "System Design", "Problem Solving", "Googleyness"],
    questions: [
      {
        title: "Design a URL Shortener",
        category: "System Design",
        difficulty: "Medium"
      },
      {
        title: "Implement LRU Cache",
        category: "Data Structures",
        difficulty: "Medium"
      },
      {
        title: "Find the median of two sorted arrays",
        category: "Algorithms",
        difficulty: "Hard"
      },
      {
        title: "Tell me about a time you failed and what you learned",
        category: "Behavioral",
        difficulty: "Easy"
      }
    ],
    tips: [
      "Focus on communication - explain your thought process clearly",
      "Practice coding on a whiteboard or Google Docs",
      "Know your Big O complexities",
      "Be prepared for follow-up questions on system design"
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "A",
    color: "bg-orange-500",
    description: "E-commerce & Cloud Services Leader",
    difficulty: "Hard",
    avgSalary: "$160k - $320k",
    interviewRounds: 5,
    requiredSkills: ["Leadership Principles", "System Design", "OOP", "Data Structures", "Behavioral"],
    questions: [
      {
        title: "Design Amazon's product recommendation system",
        category: "System Design",
        difficulty: "Hard"
      },
      {
        title: "Implement a priority queue",
        category: "Data Structures",
        difficulty: "Medium"
      },
      {
        title: "Tell me about a time you disagreed with your manager",
        category: "Behavioral",
        difficulty: "Easy"
      },
      {
        title: "Design a parking lot system",
        category: "OOP Design",
        difficulty: "Medium"
      }
    ],
    tips: [
      "Master the 16 Leadership Principles - use STAR format for behavioral",
      "Every answer should reference a leadership principle",
      "Be data-driven in your examples",
      "Practice system design with scalability in mind"
    ]
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "M",
    color: "bg-cyan-500",
    description: "Software & Cloud Computing",
    difficulty: "Medium-Hard",
    avgSalary: "$150k - $300k",
    interviewRounds: 4,
    requiredSkills: ["C#/.NET", "System Design", "Problem Solving", "Collaboration", "Growth Mindset"],
    questions: [
      {
        title: "Design Microsoft Teams",
        category: "System Design",
        difficulty: "Hard"
      },
      {
        title: "Reverse a linked list",
        category: "Data Structures",
        difficulty: "Easy"
      },
      {
        title: "How would you improve Azure?",
        category: "Product Sense",
        difficulty: "Medium"
      },
      {
        title: "Tell me about a time you helped a teammate",
        category: "Behavioral",
        difficulty: "Easy"
      }
    ],
    tips: [
      "Show genuine enthusiasm for Microsoft products",
      "Demonstrate growth mindset and learning ability",
      "Be collaborative in your approach to problems",
      "Know the difference between Microsoft's various products and services"
    ]
  },
  {
    id: "meta",
    name: "Meta",
    logo: "M",
    color: "bg-blue-600",
    description: "Social Media & VR/AR Innovation",
    difficulty: "Hard",
    avgSalary: "$170k - $340k",
    interviewRounds: 4,
    requiredSkills: ["React/React Native", "Algorithms", "System Design", "Product Sense", "Move Fast"],
    questions: [
      {
        title: "Design Instagram Stories",
        category: "System Design",
        difficulty: "Hard"
      },
      {
        title: "Find all anagrams in a string",
        category: "Algorithms",
        difficulty: "Medium"
      },
      {
        title: "Build a News Feed ranking algorithm",
        category: "ML System Design",
        difficulty: "Hard"
      },
      {
        title: "How would you measure the success of a feature?",
        category: "Product Sense",
        difficulty: "Medium"
      }
    ],
    tips: [
      "Practice coding in a shared doc environment",
      "Be ready to discuss trade-offs in system design",
      "Show you can move fast and make decisions",
      "Understand Meta's products deeply - FB, IG, WhatsApp"
    ]
  }
]

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Interviews</h1>
        <p className="text-muted-foreground">Prepare for interviews at top tech companies</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company List */}
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Companies</CardTitle>
            <CardDescription>Select a company to view interview details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                    selectedCompany.id === company.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:bg-muted/50'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${company.color} text-white font-bold text-xl`}>
                    {company.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    selectedCompany.id === company.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${selectedCompany.color} text-white font-bold text-2xl`}>
                {selectedCompany.logo}
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedCompany.name}</CardTitle>
                <CardDescription>{selectedCompany.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <TrendingUp className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Difficulty</p>
                <p className="font-medium">{selectedCompany.difficulty}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <Users className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Rounds</p>
                <p className="font-medium">{selectedCompany.interviewRounds}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <Star className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Salary Range</p>
                <p className="font-medium text-sm">{selectedCompany.avgSalary}</p>
              </div>
            </div>

            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="skills">Required Skills</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="tips">Interview Tips</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Key skills you should master for {selectedCompany.name} interviews:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1.5">
                        <Code className="mr-2 h-3 w-3" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {selectedCompany.questions.map((question, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{question.title}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{question.category}</Badge>
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      question.difficulty === 'Easy' ? 'bg-chart-2/20 text-chart-2' :
                                      question.difficulty === 'Medium' ? 'bg-chart-3/20 text-chart-3' :
                                      'bg-chart-5/20 text-chart-5'
                                    }`}
                                  >
                                    {question.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{question.title}</DialogTitle>
                            <DialogDescription asChild>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline">{question.category}</Badge>
                                <Badge variant="secondary">{question.difficulty}</Badge>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              This is a common interview question at {selectedCompany.name}. Practice your answer and consider edge cases.
                            </p>
                            <Link href="/interview">
                              <Button className="w-full gap-2">
                                Practice This Question
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="tips" className="mt-4">
                <div className="space-y-3">
                  {selectedCompany.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Link href="/interview">
                <Button className="w-full gap-2">
                  <BookOpen className="h-4 w-4" />
                  Start {selectedCompany.name} Mock Interview
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
