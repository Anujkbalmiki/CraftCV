import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Enable large JSON payloads for screenshots (base64 images) and resumes
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper to get Gemini Client with fallback to user-provided key if supplied
function getGeminiClient(req: Request): GoogleGenAI {
  const userKey = req.headers['x-gemini-api-key'] as string | undefined;
  const apiKey = (userKey && userKey.trim().length > 10) ? userKey.trim() : process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server, and no custom key was provided.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const userKey = req.headers['x-gemini-api-key'] as string | undefined;
  const hasEnvKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  const hasUserKey = !!(userKey && userKey.trim().length > 10);

  res.json({
    status: 'ok',
    hasApiKey: hasEnvKey || hasUserKey,
    hasServerKey: hasEnvKey,
    hasUserKey: hasUserKey,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint 1: Extract Job Description from Screenshot (Multimodal) or Raw Text
app.post('/api/extract-jd', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, text } = req.body;

    if (!imageBase64 && (!text || text.trim().length === 0)) {
      res.status(400).json({ error: 'Please provide either a screenshot image or pasted job description text.' });
      return;
    }

    const ai = getGeminiClient(req);

    const extractionPrompt = `You are an expert ATS (Applicant Tracking System) parser and corporate recruiter.
Analyze the provided Job Description (from screenshot or text) and extract detailed structured information in clean JSON format.

JSON Schema to return:
{
  "jobTitle": "string (e.g. Senior Frontend Engineer)",
  "companyName": "string (e.g. Stripe, or 'Company Name' if not detected)",
  "industry": "string (e.g. Fintech, SaaS, Healthcare, etc.)",
  "location": "string (e.g. San Francisco, CA / Remote)",
  "employmentType": "string (e.g. Full-time, Contract, etc.)",
  "experienceRequired": "string (e.g. 5+ years of experience in React/Node)",
  "hardSkills": ["array of exact technical skills, tools, frameworks, languages, e.g. React, TypeScript, GraphQL, Docker, Next.js, Jest"],
  "softSkills": ["array of behavioral, leadership and soft skills, e.g. Cross-functional communication, Mentorship, Agile/Scrum, Problem-solving"],
  "atsKeywords": [
    {
      "keyword": "string",
      "priority": "critical" | "high" | "medium",
      "category": "technical" | "domain" | "leadership" | "methodology"
    }
  ],
  "keyResponsibilities": ["array of top 4-6 primary job responsibilities"],
  "qualifications": ["array of top requirements / education / experience minimums"],
  "companyCultureClues": "brief 1-2 sentence assessment of tone, values, and what kind of candidate will stand out"
}

Ensure the JSON is strictly valid. Return ONLY the JSON object, without backticks or markdown code fences if possible.`;

    let response;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      const validMime = mimeType || 'image/png';

      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: validMime,
              data: cleanBase64,
            },
          },
          {
            text: extractionPrompt,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    } else {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            text: `${extractionPrompt}\n\nHere is the Job Description text:\n"""\n${text}\n"""`,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback regex extraction if codeblock wrapped
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse Gemini output as JSON.');
      }
    }

    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in /api/extract-jd:', err);
    res.status(500).json({
      error: err.message || 'An error occurred while analyzing the Job Description.',
    });
  }
});

// Endpoint 2: Parse Base Resume into Structured Format
app.post('/api/parse-resume', async (req: Request, res: Response) => {
  try {
    const { resumeText, imageBase64, mimeType } = req.body;

    if (!resumeText && !imageBase64) {
      res.status(400).json({ error: 'Please provide resume text or document/image.' });
      return;
    }

    const ai = getGeminiClient(req);

    const parsePrompt = `You are an elite executive resume analyst.
Parse the candidate's resume into a clean, comprehensive structured JSON object with all sections faithfully extracted.

JSON Schema:
{
  "fullName": "Candidate Name",
  "headline": "Current Professional Title or Target Role",
  "email": "email@example.com",
  "phone": "+1 (555) 000-0000",
  "location": "City, State or Country",
  "linkedin": "linkedin.com/in/...",
  "website": "portfolio or github link if present",
  "summary": "Executive summary paragraph",
  "skills": {
    "technical": ["list of technical skills/languages"],
    "tools": ["list of tools/platforms"],
    "soft": ["leadership, communication, etc."]
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "role": "Job Title",
      "location": "City, State or Remote",
      "startDate": "Mon Year",
      "endDate": "Present or Mon Year",
      "current": true or false,
      "bullets": [
        "Quantified bullet point starting with active past-tense verb",
        "Bullet point..."
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University / School",
      "degree": "B.S. in Computer Science",
      "fieldOfStudy": "Computer Science",
      "gradYear": "2021",
      "gpa": "3.8/4.0 (if present)"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "description": "Brief description",
      "techStack": ["React", "TypeScript", "Node.js"],
      "link": "github/demo link if present",
      "bullets": ["Project bullet point 1", "Project bullet point 2"]
    }
  ],
  "certifications": ["AWS Certified Solutions Architect", "etc."]
}

Return ONLY strict valid JSON.`;

    let response;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: cleanBase64,
            },
          },
          { text: parsePrompt },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    } else {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            text: `${parsePrompt}\n\nHere is the resume content:\n"""\n${resumeText}\n"""`,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const raw = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error('Failed to parse resume JSON.');
    }

    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error in /api/parse-resume:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume.' });
  }
});

// Endpoint 3: Calculate ATS Score & Skill Gap Analysis
app.post('/api/ats-score', async (req: Request, res: Response) => {
  try {
    const { resumeProfile, jobDescription } = req.body;

    if (!resumeProfile || !jobDescription) {
      res.status(400).json({ error: 'Missing resume profile or job description.' });
      return;
    }

    const ai = getGeminiClient(req);

    const atsPrompt = `You are a modern Applicant Tracking System (ATS) matching algorithm (like Greenhouse, Lever, Workday) and a senior talent acquisition auditor.
Compare this candidate's base resume profile against the extracted job description requirements.

Evaluate strictly:
1. Overall Match Score (0 to 100):
   - 90-100: Exceptional fit, high keyword density and strong measurable alignment
   - 75-89: Strong candidate, missing minor secondary keywords
   - 60-74: Moderate fit, needs targeted alignment and phrasing overhaul
   - Under 60: Significant skill/experience gap
2. Breakdown:
   - skillMatchScore (0-100): How many hard & technical skills match
   - experienceScore (0-100): Seniority, years of experience, scale of work
   - keywordRelevanceScore (0-100): Presence of high-priority ATS keyword triggers
   - formattingAtsScore (0-100): Cleanliness, bullet structure, action verb usage
3. Matched Skills: List of skills present in both JD and resume.
4. Missing High-Priority Keywords: Critical skills or concepts in JD that are absent or underrepresented in the resume.
5. Actionable Recommendations: 3-5 specific, high-yield pieces of advice to optimize the resume for this exact role.

Return JSON Schema:
{
  "overallScore": number (0-100),
  "breakdown": {
    "skillMatchScore": number,
    "experienceScore": number,
    "keywordRelevanceScore": number,
    "formattingAtsScore": number
  },
  "summary": "1-2 sentence executive verdict on fit",
  "matchedSkills": ["skill1", "skill2", ...],
  "missingKeywords": ["missing1", "missing2", ...],
  "recommendations": [
    {
      "type": "critical" | "warning" | "tip",
      "title": "Short title",
      "advice": "Clear actionable instruction"
    }
  ]
}

Strictly output valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `${atsPrompt}\n\nJob Description:\n${JSON.stringify(jobDescription, null, 2)}\n\nCandidate Resume Profile:\n${JSON.stringify(resumeProfile, null, 2)}`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
      else throw new Error('Failed to parse ATS score JSON.');
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /api/ats-score:', err);
    res.status(500).json({ error: err.message || 'Failed to calculate ATS score.' });
  }
});

// Endpoint 4: One-Click Resume Tailoring
app.post('/api/tailor-resume', async (req: Request, res: Response) => {
  try {
    const { resumeProfile, jobDescription, tone = 'confident', customInstructions = '' } = req.body;

    if (!resumeProfile || !jobDescription) {
      res.status(400).json({ error: 'Missing resume profile or job description.' });
      return;
    }

    const ai = getGeminiClient(req);

    const tailorPrompt = `You are a world-class professional resume writer specializing in ATS optimization and executive recruitment.
Your task is to tailor the candidate's resume for the target job: "${jobDescription.jobTitle}" at "${jobDescription.companyName}".

RULES & ETHICAL BOUNDARIES:
1. NEVER fabricate false jobs, companies, degrees, or years of tenure. Stay anchored to the candidate's actual roles.
2. REWRITE each bullet point to start with high-impact active verbs (e.g., Architected, Speaheaded, Engineered, Accelerated, Overhauled, Optimized).
3. Weave in the missing high-priority ATS keywords from the job description naturally into the bullet points and summary where contextually plausible.
4. Apply the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]".
5. Provide a magnetic, tailored professional summary specifically addressed to ${jobDescription.companyName} and this role.
6. Tone to apply: ${tone} (e.g., confident, high-impact, articulate, metrics-driven).
${customInstructions ? `Additional candidate instructions: "${customInstructions}"` : ''}

JSON Schema to return:
{
  "tailoredSummary": "A powerful 3-4 sentence professional summary explicitly targeted to ${jobDescription.jobTitle} at ${jobDescription.companyName}, spotlighting relevant competencies.",
  "tailoredHeadline": "string (optimized professional headline)",
  "tailoredExperiences": [
    {
      "id": "matching original experience id",
      "company": "original company",
      "role": "original role or slightly refined title if truthful",
      "location": "location",
      "startDate": "startDate",
      "endDate": "endDate",
      "current": boolean,
      "bullets": [
        "Tailored high-impact bullet point 1",
        "Tailored high-impact bullet point 2"
      ],
      "keywordsInjected": ["keywords from JD incorporated into this job"]
    }
  ],
  "tailoredSkills": {
    "technical": ["prioritized list with target JD skills front-and-center"],
    "tools": ["prioritized list"],
    "soft": ["relevant behavioral skills from JD"]
  },
  "tailoredProjects": [
    {
      "id": "original project id",
      "name": "project name",
      "description": "tailored description",
      "techStack": ["tech stack"],
      "link": "link",
      "bullets": ["tailored bullet point 1"]
    }
  ],
  "alignmentHighlights": [
    "1-2 bullet points explaining how this version will dramatically increase interview callback rates for this specific role"
  ],
  "projectedAtsScore": number (e.g. 92-98)
}

Return strictly valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `${tailorPrompt}\n\nTarget Job Description:\n${JSON.stringify(jobDescription, null, 2)}\n\nOriginal Resume:\n${JSON.stringify(resumeProfile, null, 2)}`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
      else throw new Error('Failed to parse tailored resume JSON.');
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /api/tailor-resume:', err);
    res.status(500).json({ error: err.message || 'Failed to tailor resume.' });
  }
});

// Endpoint 5: Generate Targeted Cover Letter
app.post('/api/generate-cover-letter', async (req: Request, res: Response) => {
  try {
    const { resumeProfile, jobDescription, tone = 'enthusiastic_professional', customInstructions = '' } = req.body;

    if (!resumeProfile || !jobDescription) {
      res.status(400).json({ error: 'Missing resume profile or job description.' });
      return;
    }

    const ai = getGeminiClient(req);

    const coverLetterPrompt = `You are an elite career strategist and executive speechwriter.
Craft an authentic, high-converting 3-4 paragraph cover letter for:
Candidate: ${resumeProfile.fullName}
Target Role: ${jobDescription.jobTitle}
Company: ${jobDescription.companyName}
Industry: ${jobDescription.industry || 'Technology'}

STRUCTURE REQUIREMENTS:
1. Header: Date, Candidate Name, Contact, Recipient: "Hiring Team for ${jobDescription.jobTitle}, ${jobDescription.companyName}".
2. Opening Paragraph: A punchy hook that mentions the exact position, shows genuine insight into ${jobDescription.companyName}'s current stage or challenges, and summarizes why the candidate is uniquely suited.
3. Body Paragraph 1 (Deep Competency & Results): Focus on 1-2 major past technical or business achievements from the resume that directly solve the core requirements in the JD. Use real numbers/metrics where available in the resume.
4. Body Paragraph 2 (Culture, Leadership & Method): Demonstrate how the candidate collaborates, tackles ambiguity, or scales solutions, mirroring the company culture clues.
5. Closing Paragraph: Reiterate enthusiasm, state clear value to be delivered in the first 90 days, and provide a polite, confident call to action for an interview conversation.
6. Sign-off: "Sincerely,\\n${resumeProfile.fullName}"

Tone: ${tone} (authentic, persuasive, avoiding robotic boilerplate like "I am writing to express my interest in...").
${customInstructions ? `Special requests: ${customInstructions}` : ''}

JSON Schema:
{
  "subject": "Application for ${jobDescription.jobTitle} - ${resumeProfile.fullName}",
  "salutation": "Dear ${jobDescription.companyName} Hiring Team,",
  "paragraphs": [
    "Paragraph 1 text...",
    "Paragraph 2 text...",
    "Paragraph 3 text...",
    "Paragraph 4 text..."
  ],
  "fullText": "Full formatted markdown/text of the letter including header and sign-off",
  "keySellingPoints": ["Selling point 1", "Selling point 2", "Selling point 3"]
}

Return strictly valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `${coverLetterPrompt}\n\nJob Description:\n${JSON.stringify(jobDescription, null, 2)}\n\nCandidate Resume:\n${JSON.stringify(resumeProfile, null, 2)}`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
      else throw new Error('Failed to parse cover letter JSON.');
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /api/generate-cover-letter:', err);
    res.status(500).json({ error: err.message || 'Failed to generate cover letter.' });
  }
});

// Start Express server with Vite middleware in dev or static serving in prod
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
