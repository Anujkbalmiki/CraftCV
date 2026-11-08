# Craft-CV — AI Resume Tailor & Cover Letter Studio

An ATS-optimization and career tailoring web application that transforms Job Description (JD) screenshots or raw text into tailored resumes and matching cover letters with recruiter-validated templates and multi-format exports.

![Craft-CV Application](https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80)

---

## ⚡ Core Features

1. **Multimodal Job Description Ingestion**
   - **Screenshot Dropzone**: Accepts images (PNG, JPG, WEBP) of JD postings from LinkedIn, Indeed, or company career portals.
   - **Gemini Vision Extraction**: Powered by `gemini-3.8-flash` to extract Job Title, Company Name, Industry, Experience Requirements, Hard Skills, Soft Skills, and critical ATS keyword triggers.
   - **Interactive Keyword Tags**: Toggle individual keywords or add custom keywords to enforce in the tailored output.
   - **1-Click Presets**: Pre-configured real-world job postings (*Stripe*, *Anthropic*, *Figma*) for instant testing.

2. **Persistent Base Career Profile & AI Parser**
   - **Master Profile**: Stored in `localStorage` so candidates never re-enter their work history.
   - **AI Resume Parser**: Upload existing resume files or paste text to parse into structured JSON.
   - **Tabbed Editor**: Structured forms for Contact details, Work Experience, Skills, Education, and Projects.

3. **ATS Match & Keyword Gap Analysis**
   - **0–100% Circular ATS Gauge**: Real-time pass probability calculation.
   - **4-Pillar Breakdown**: Hard Skills Overlap, Experience & Seniority, Keyword Density, and Bullet Formatting.
   - **Skill Gap Radar**: Compares matched skills (green) against missing critical keywords (amber/red).
   - **Actionable Alignment Advice**: Tailored strategic tips before generating documents.

4. **One-Click AI Tailoring & Synchronized Generation**
   - **Tailored Resume**: Rewrites bullets using the Google XYZ formula (*Accomplished X measured by Y by doing Z*) with active verbs and integrated keywords without fabricating untrue qualifications.
   - **Targeted Cover Letter**: A 4-paragraph cover letter addressing company goals, technical accomplishments, culture fit, and call to action.
   - **Side-by-Side Rich Editors**: Compare base bullets with tailored bullets and edit any sentence.
   - **Tone Selector**: Choose between *Confident*, *Executive*, *Technical*, and *Leadership* styles.

5. **Gallery of 7 Distinct Resume Templates**
   - **ATS Clean Standard**: 99% ATS parseability, universal compatibility with Taleo, Greenhouse, Workday, and Lever.
   - **Executive Slate**: Deep navy banner lockup and crisp rule dividers for senior and staff leaders.
   - **Tech & Systems Mono**: Monospace tabular figures, developer badges, and latency benchmarks.
   - **Nordic Minimalist**: Generous whitespace and refined typography.
   - **Two-Column Metro**: 30/70 split rail separating core credentials from detailed work history.
   - **Ivy League Traditional**: Classic serif typography and centered academic formatting for finance and consulting.
   - **Compact 1-Page Fit**: Tight vertical layout designed to fit dense experience onto a single page.

6. **Multi-Format Export & Application Tracker**
   - **ATS PDF Export**: High-resolution print-to-PDF formatting via native print stylesheets.
   - **Word DOCX**: Download standard `.doc`/`.docx` formatted documents.
   - **Markdown Copy**: 1-click clipboard copy of clean Markdown.
   - **Application Tracker**: Pipeline dashboard tracking Company, Role, Date, ATS Score, and Application Status (*Saved*, *Applied*, *Interviewing*, *Offered*, *Archived*).

7. **Interactive Onboarding Tour & Dual-Theme UI**
   - **5-Step Onboarding Tour**: Guided tooltips for new users.
   - **Theme Toggle**: Full Light and Dark mode support via Tailwind CSS v4.
   - **API Settings**: Option to link a personal Google Gemini API key or use the server environment key.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend / API**: Express 4 running via `server.ts` with Vite middlewares in development.
- **AI SDK**: `@google/genai` (utilizing `gemini-3.8-flash` for multimodal vision OCR, resume parsing, ATS scoring, and targeted document synthesis).
- **Tooling**: Vite 8, tsx, esbuild.

---

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/craft-cv.git
cd craft-cv
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
# Required for Gemini AI API calls
GEMINI_API_KEY="your-gemini-api-key-here"

# Port (defaults to 3000)
PORT=3000
```
> Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 📦 Pushing to GitHub

To push this codebase to your GitHub account:

```bash
# 1. Initialize git and commit files
git init
git add .
git commit -m "Initial commit: Craft-CV AI Resume Tailor & Cover Letter Studio"

# 2. Add your GitHub remote repository
# (Create a new empty repository on https://github.com/new first)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 3. Rename default branch to main and push
git branch -M main
git push -u origin main
```

---

## 📄 License

Apache-2.0 License.
