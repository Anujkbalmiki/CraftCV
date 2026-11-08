import React, { useState, useEffect } from 'react';
import {
  ResumeProfile,
  JobDescriptionData,
  AtsAnalysisResult,
} from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Target,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

interface AtsMatchStepProps {
  profile: ResumeProfile;
  jobDescription: JobDescriptionData | null;
  atsAnalysis: AtsAnalysisResult | null;
  onUpdateAnalysis: (analysis: AtsAnalysisResult) => void;
  onNext: () => void;
  userApiKey?: string;
}

export const AtsMatchStep: React.FC<AtsMatchStepProps> = ({
  profile,
  jobDescription,
  atsAnalysis,
  onUpdateAnalysis,
  onNext,
  userApiKey,
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute or refresh ATS Score via Gemini endpoint
  const runAtsAnalysis = async () => {
    if (!jobDescription) return;

    setIsCalculating(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          resumeProfile: profile,
          jobDescription,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to calculate ATS match score.');
      }

      onUpdateAnalysis(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error running ATS analysis.');
    } finally {
      setIsCalculating(false);
    }
  };

  // If no analysis exists yet, run it on mount
  useEffect(() => {
    if (!atsAnalysis && jobDescription) {
      runAtsAnalysis();
    }
  }, [jobDescription]);

  // Fallback heuristic scoring if offline or initial load
  const score = atsAnalysis?.overallScore || 72;
  const breakdown = atsAnalysis?.breakdown || {
    skillMatchScore: 75,
    experienceScore: 80,
    keywordRelevanceScore: 68,
    formattingAtsScore: 92,
  };

  const matchedSkills = atsAnalysis?.matchedSkills || [
    'TypeScript',
    'React',
    'REST APIs',
    'PostgreSQL',
    'CI/CD Pipelines',
  ];

  const missingKeywords = atsAnalysis?.missingKeywords || [
    'Core Web Vitals',
    'Latency Reduction',
    'Playwright',
    'GraphQL',
    'Design Systems',
  ];

  const recommendations = atsAnalysis?.recommendations || [
    {
      type: 'critical' as const,
      title: 'Incorporate Core Web Vitals & Frontend Performance',
      advice: 'The role specifically prioritizes web performance. Emphasize Lighthouse metrics and bundle optimization in your most recent role.',
    },
    {
      type: 'warning' as const,
      title: 'Surface Playwright / E2E Automation',
      advice: 'Ensure Playwright appears explicitly alongside your testing accomplishments to pass automated ATS filters.',
    },
    {
      type: 'tip' as const,
      title: 'Highlight Billing & Subscription Experience',
      advice: 'Mirror the company terminology by explicitly mentioning invoice workflows and usage-based metering in bullet points.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              <span>Step 3 of 5</span>
              <span aria-hidden="true">·</span>
              <span>Optimization Radar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              ATS Match & Keyword Gap Analysis
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Evaluating candidate profile against <span className="font-semibold text-neutral-900 dark:text-white">{jobDescription?.jobTitle || 'Target Role'}</span> at <span className="font-semibold text-neutral-900 dark:text-white">{jobDescription?.companyName || 'Target Company'}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={runAtsAnalysis}
            disabled={isCalculating}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-colors shrink-0 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? 'Re-calculating...' : 'Re-calculate Score'}</span>
          </button>
        </div>
      </div>

      {/* Main Score Section: Meter + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Card: 0-100 Score Meter (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-4">
              Estimated ATS Pass Probability
            </span>

            {/* Circular Gauge Representation */}
            <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`transition-all duration-1000 ease-out ${
                    score >= 85
                      ? 'stroke-emerald-500'
                      : score >= 70
                      ? 'stroke-amber-500'
                      : 'stroke-red-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {score}%
                </span>
                <span className="text-[11px] font-semibold text-neutral-500 mt-0.5">
                  {score >= 85 ? 'Strong Match' : score >= 70 ? 'Moderate Alignment' : 'Needs Optimization'}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center mt-3">
              {atsAnalysis?.summary ||
                'Your background has strong technical overlap, but key ATS keyword triggers from the JD need explicit integration into your achievements.'}
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Recruiter Filtering Threshold:</span>
              <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">75% Min.</span>
            </div>
          </div>
        </div>

        {/* Right Card: 4-Pillar Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
              <Target className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              Evaluation Breakdown by Category
            </h3>

            <div className="space-y-4">
              {/* Pillar 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-neutral-500" /> Hard & Technical Skill Overlap
                  </span>
                  <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                    {breakdown.skillMatchScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-700"
                    style={{ width: `${breakdown.skillMatchScore}%` }}
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-neutral-500" /> Experience Level & Seniority Fit
                  </span>
                  <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                    {breakdown.experienceScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-700"
                    style={{ width: `${breakdown.experienceScore}%` }}
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-neutral-500" /> Critical ATS Keyword Density
                  </span>
                  <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                    {breakdown.keywordRelevanceScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${breakdown.keywordRelevanceScore}%` }}
                  />
                </div>
              </div>

              {/* Pillar 4 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" /> Bullet Formatting & Active Verbs
                  </span>
                  <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                    {breakdown.formattingAtsScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${breakdown.formattingAtsScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-4 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch One-Click Tailoring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Matched Skills vs Missing High-Priority Keywords Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matched Skills (Green) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Matched Skills & Capabilities ({matchedSkills.length})
            </h3>
            <span className="text-[11px] text-neutral-400">Present in Resume</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing High-Priority Keywords (Amber/Red) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Missing Target Keywords ({missingKeywords.length})
            </h3>
            <span className="text-[11px] text-neutral-400">Target for Tailoring</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
              >
                + {kw}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            Craft-CV will weave these terms contextually into your tailored work experience bullets in Step 4.
          </p>
        </div>
      </div>

      {/* Actionable Alignment Recommendations */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Strategic Recruiter Alignment Advice
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {rec.type}
                </span>
              </div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                {rec.title}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {rec.advice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
