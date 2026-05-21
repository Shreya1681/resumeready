import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

const systemPrompt = `You are an expert AI interviewer conducting a technical interview.
You are friendly but professional, and your goal is to help the candidate demonstrate their skills.

Guidelines:
- Welcome the candidate warmly and introduce yourself as an AI Technical Interviewer
- Ask one clear technical question at a time and wait for the candidate's response
- Provide thoughtful follow-up questions based on the candidate's answers
- Give constructive feedback when appropriate
- Be encouraging but challenge the candidate to think deeper
- If the answer is incomplete, guide them toward a more complete response
- Keep responses concise but helpful (2-4 sentences typically)
- Consider technical accuracy, communication clarity, and problem-solving approach`

function toCoreMessages(uiMessages: any[]) {
  return uiMessages
    .filter((m: any) => m.role === 'user' || m.role === 'assistant')
    .map((m: any) => {
      let content = ''
      if (typeof m.content === 'string') {
        content = m.content
      } else if (Array.isArray(m.parts)) {
        content = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      } else if (Array.isArray(m.content)) {
        content = m.content
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      }
      return { role: m.role as 'user' | 'assistant', content }
    })
    .filter((m: any) => m.content.trim().length > 0)
}

// Try models in order — 1.5-flash has 1500 req/day free vs 2.5-flash's 20/day
const MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const coreMessages = toCoreMessages(body.messages ?? [])

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: coreMessages,
      maxOutputTokens: 500,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error('Interview chat error:', error?.message ?? error)
    return new Response(JSON.stringify({ error: 'Failed to stream response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
