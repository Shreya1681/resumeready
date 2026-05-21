const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { streamText, generateObject } = require('ai');
const { z } = require('zod');
const Interview = require('../models/Interview');

// Initialize Google provider using backend environment key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Feedback Schema for MOCK evaluation
const InterviewFeedbackSchema = z.object({
  overallScore: z.number().describe('Overall interview performance score 0-100'),
  technicalScore: z.number().describe('Technical knowledge score 0-100'),
  communicationScore: z.number().describe('Communication clarity score 0-100'),
  problemSolvingScore: z.number().describe('Problem-solving ability score 0-100'),
  strengths: z.array(z.string()).describe('Key strengths demonstrated'),
  improvements: z.array(z.string()).describe('Areas needing improvement'),
  questionFeedback: z.array(z.object({
    question: z.string(),
    score: z.number(),
    feedback: z.string(),
    suggestions: z.string(),
  })).describe('Detailed feedback for each question'),
  overallFeedback: z.string().describe('General feedback summary'),
  nextSteps: z.array(z.string()).describe('Recommended next steps for preparation'),
});

/**
 * Streams the technical mock interview questions to the client.
 */
async function handleChatStream(req, res) {
  try {
    console.log('Incoming chat body:', JSON.stringify(req.body, null, 2));
    const { messages, questionContext, resumeContext } = req.body;

    const systemPrompt = `You are an expert AI interviewer conducting a technical interview. 
You are friendly but professional, and your goal is to help the candidate demonstrate their skills.

Current Question Context:
${questionContext || 'General interview question'}

Candidate Resume Summary:
${resumeContext || 'No resume data available'}

Guidelines:
- Provide thoughtful follow-up questions based on the candidate's answers
- Give constructive feedback when appropriate
- Be encouraging but also challenge the candidate to think deeper
- If the answer is incomplete, guide them toward a more complete response
- Keep responses concise but helpful (2-4 sentences typically)
- When evaluating answers, consider technical accuracy, communication clarity, and problem-solving approach`;

    const coreMessages = (messages || []).map((m) => {
      let content = '';
      if (m.parts && Array.isArray(m.parts)) {
        content = m.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text)
          .join('');
      } else if (m.content) {
        content = m.content;
      } else if (typeof m.text === 'string') {
        content = m.text;
      }
      
      return {
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: content
      };
    });

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: coreMessages,
      maxOutputTokens: 500,
    });

    result.pipeDataStreamToResponse(res);
  } catch (error) {
    console.error('Chat stream controller error:', error);
    return res.status(500).json({ error: error.message || 'Error occurred during streaming' });
  }
}

/**
 * Evaluates performance scores and provides detailed mock reports.
 */
async function handleFeedbackEvaluation(req, res) {
  try {
    const { questions, answers, resumeContext, userId, timeSpent } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ error: 'Missing questions or answers' });
    }

    const qaPairs = questions.map((q, i) => 
      `Question ${i + 1}: ${q}\nAnswer: ${answers[i] || 'No answer provided'}`
    ).join('\n\n');

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: InterviewFeedbackSchema,
      prompt: `You are an expert interview coach analyzing a mock interview performance.

Candidate Background:
${resumeContext || 'No resume information available'}

Interview Q&A:
${qaPairs}

Provide comprehensive, constructive feedback that will help the candidate improve.
Be specific with examples from their answers and actionable suggestions.`,
    });

    // If userId is provided, save the interview report to MongoDB so it is persistent!
    if (userId) {
      console.log(`Saving interview session to MongoDB for user: ${userId}`);
      const newInterview = new Interview({
        userId,
        questions,
        answers,
        overallScore: object.overallScore,
        technicalScore: object.technicalScore,
        communicationScore: object.communicationScore,
        problemSolvingScore: object.problemSolvingScore,
        strengths: object.strengths,
        improvements: object.improvements,
        questionFeedback: object.questionFeedback,
        overallFeedback: object.overallFeedback,
        nextSteps: object.nextSteps,
        timeSpent: timeSpent || 0,
      });
      await newInterview.save();
    }

    return res.json(object);
  } catch (error) {
    console.error('Feedback evaluation controller error:', error);
    return res.status(500).json({ error: error.message || 'Error occurred during feedback evaluation' });
  }
}

/**
 * Fetches the interview history for a user
 */
async function getInterviewHistory(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'No userId provided' });
    }

    const history = await Interview.find({ userId }).sort({ createdAt: -1 });
    return res.json(history);
  } catch (error) {
    console.error('Get interview history controller error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch history' });
  }
}

module.exports = {
  handleChatStream,
  handleFeedbackEvaluation,
  getInterviewHistory
};

