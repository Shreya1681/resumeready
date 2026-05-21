const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { generateObject } = require('ai');
const { z } = require('zod');
const Resume = require('../models/Resume');

// Initialize Google provider using backend environment key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Resume ATS Analysis Schema
const ResumeAnalysisSchema = z.object({
  score: z.number().describe('Overall resume score from 0-100'),
  skills: z.array(z.string()).describe('List of identified technical and soft skills'),
  experience: z.object({
    years: z.number().describe('Estimated years of experience'),
    level: z.string().describe('Junior, Mid-level, Senior, or Lead'),
    companies: z.array(z.string()).describe('List of companies mentioned'),
  }),
  strengths: z.array(z.string()).describe('Key strengths identified in the resume'),
  improvements: z.array(z.string()).describe('Suggested improvements for the resume'),
  keywords: z.array(z.string()).describe('Important keywords for ATS optimization'),
  summary: z.string().describe('Brief professional summary'),
});

/**
 * Controller to handle resume text parsing and ATS optimization scores
 */
async function analyzeResume(req, res) {
  try {
    const { resumeText, userId } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'No resume text provided' });
    }

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: ResumeAnalysisSchema,
      prompt: `Analyze the following resume and extract structured information. 
Be thorough but concise in your analysis.

Resume:
${resumeText}

Provide a comprehensive analysis including skills, experience level, strengths, 
areas for improvement, and ATS-friendly keywords.`,
    });

    // If userId is provided, upsert this analysis in MongoDB so it is persistent!
    if (userId) {
      console.log(`Saving resume analysis to MongoDB for user: ${userId}`);
      await Resume.findOneAndUpdate(
        { userId },
        {
          resumeText,
          score: object.score,
          skills: object.skills,
          experience: object.experience,
          strengths: object.strengths,
          improvements: object.improvements,
          keywords: object.keywords,
          summary: object.summary,
          createdAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    return res.json(object);
  } catch (error) {
    console.error('Resume analysis controller error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
}

/**
 * Controller to fetch the active resume analysis for a user
 */
async function getActiveResume(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'No userId provided' });
    }

    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found for this user' });
    }

    return res.json(resume);
  } catch (error) {
    console.error('Get active resume controller error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch resume' });
  }
}

module.exports = {
  analyzeResume,
  getActiveResume
};

