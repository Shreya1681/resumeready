# ResumeReady - AI Resume Optimizer & Mock Interview Room

ResumeReady is a premium, AI-powered fullstack platform designed to help job seekers optimize their resumes for ATS systems and practice technical interviews in a simulated, interactive mock interview room powered by Gemini AI.

## Project Structure

This repository is organized as a monorepo containing:
*   **`backend/`**: An Express server running on port `5000` that handles Gemini AI prompt streaming, resume analysis persistence, and interview history tracking in MongoDB Atlas.
*   **`frontend/`**: A Next.js 15 app running on port `3000` featuring a premium glassmorphic dashboard, resume upload analysis, and a real-time AI interview practice room.

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) (or MongoDB Atlas connection) set up.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file with your credentials:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env.local` file with NextAuth keys:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   AUTH_SECRET=your_nextauth_secret
   
   # For Google OAuth Login
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

## Main Features

1.  **AI Resume Analyzer**: Upload a PDF or copy resume text to extract skills, calculate an ATS compatibility score (0-100), identify keywords, and receive tailored suggestions for improvements.
2.  **AI Mock Interview Room**: Conduct realistic technical interviews with AI-coached conversational threads, including live webcam simulation, question follow-ups, and user answer speech/text matching.
3.  **Detailed Analytics & History**: Get graded on Technical knowledge, Communication clarity, and Problem-Solving skills with visual chart progressions and checklist actions.
