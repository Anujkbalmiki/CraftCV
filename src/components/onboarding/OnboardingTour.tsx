import React, { useState } from 'react';
import {
  FileText,
  ScanSearch,
  Sparkles,
  LayoutTemplate,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToStep: (stepNumber: number) => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  highlightAction: string;
  targetStepNumber: number;
  tips: string[];
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onGoToStep,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const tourSteps: TourStep[] = [
    {
      title: '1. Ingest Any Job Description',
      subtitle: 'Multimodal Screenshot & Text Extraction',
      icon: <ScanSearch className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      content:
        'Drop a screenshot of any job post (LinkedIn, Indeed, company career page) or paste raw text. Gemini Vision instantly extracts the Job Title, Company, Core Hard Skills, Soft Skills, and high-priority ATS triggers as interactive tag pills.',
      highlightAction: 'Drop screenshot or click a 1-click Preset to test immediately.',
      targetStepNumber: 1,
      tips: [
        'Works with partial screenshots or multi-column job ads.',
        'Extracted keywords can be toggled on or off to refine targeting.',
        'Add custom keywords to force specific ATS term inclusion.',
      ],
    },
    {
      title: '2. Your Base Career Profile',
      subtitle: 'Upload Once, Tailor Everywhere',
      icon: <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      content:
        'Upload your existing resume (PDF, DOCX, or text) to parse it into structured JSON, or use our tabbed career editor. Craft-CV securely remembers your profile so you never re-type your history.',
      highlightAction: 'A realistic senior engineer profile is preloaded so you can start right away.',
      targetStepNumber: 2,
      tips: [
        'Your contact info, work history, skills, and projects stay private.',
        'AI parses complex bullet points into structured career achievements.',
        'You can edit any role, company, or metric at any time.',
      ],
    },
    {
      title: '3. Instant ATS Match Score',
      subtitle: 'Recruiter Radar & Keyword Gap Analysis',
      icon: <CheckCircle2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      content:
        'See your real-time 0–100% ATS score before applying. Our matching engine breaks down technical skill overlap, seniority alignment, and flags missing high-priority keywords that recruiters filter on.',
      highlightAction: 'Review green matched skills versus amber/red keyword gaps.',
      targetStepNumber: 3,
      tips: [
        'Identifies exact missing keywords prioritized by Taleo, Greenhouse, and Workday.',
        'Provides actionable advice cards before you begin tailoring.',
      ],
    },
    {
      title: '4. AI Tailoring & Cover Letter Studio',
      subtitle: 'Active Action Verbs without Falsehoods',
      icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      content:
        'With one click, Gemini rewrites your bullet points using the Google XYZ formula ("Accomplished X, measured by Y, by doing Z"), weaves in target keywords, and drafts a customized 4-paragraph cover letter.',
      highlightAction: 'Compare original vs tailored bullets with live keyword highlighting.',
      targetStepNumber: 4,
      tips: [
        'Ethical guarantee: Never fabricates untrue companies, roles, or degrees.',
        'Tone selector: Choose Confident, Executive, Technical, or Leadership style.',
        'Side-by-side rich editor allows full manual editing of any sentence.',
      ],
    },
    {
      title: '5. 7 Templates, PDF Export & Tracker',
      subtitle: 'ATS-Friendly Downloads & Career Management',
      icon: <LayoutTemplate className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      content:
        'Choose from our gallery of 7 professionally designed resume templates (Classic ATS, Executive Slate, Tech Mono, Nordic Clean, Sidebar Split, Ivy Traditional, and Compact 1-Page). Download clean vector PDFs, standard DOCX, or track your application status.',
      highlightAction: 'Switch templates with 1 click and download print-ready PDFs.',
      targetStepNumber: 5,
      tips: [
        'Templates maintain strict ATS parseability without styling glitches.',
        'Application Tracker saves past tailored resumes, cover letters, and scores.',
      ],
    },
  ];

  const current = tourSteps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === tourSteps.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onGoToStep(tourSteps[nextIdx].targetStepNumber);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onGoToStep(tourSteps[prevIdx].targetStepNumber);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    onGoToStep(tourSteps[index].targetStepNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top bar with progress indicator */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Step {currentStepIndex + 1} of {tourSteps.length}
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {current.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {current.content}
          </p>

          {/* Action callout */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
            <span className="text-xs font-semibold text-neutral-900 dark:text-white block mb-1">
              Interactive Action:
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {current.highlightAction}
            </span>
          </div>

          {/* Bulleted Pro Tips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
              Pro Tips:
            </span>
            <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 pl-4 list-disc">
              {current.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step dots navigation */}
        <div className="px-6 py-2 flex items-center justify-center gap-1.5 bg-neutral-50/50 dark:bg-neutral-950/40">
          {tourSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-6 bg-neutral-900 dark:bg-white'
                  : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
              }`}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-1 shadow-sm"
            >
              {isLast ? 'Start Tailoring Now' : 'Next Step'}
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
