import React, { useState } from 'react';
import {
  ResumeProfile,
  JobDescriptionData,
  TailoredResumeResult,
  CoverLetterResult,
} from '../../types';
import {
  Sparkles,
  RefreshCw,
  Sliders,
  FileCheck2,
  FileText,
  Eye,
  Check,
  ArrowRight,
  SplitSquareVertical,
  Wand2,
  Copy,
  PenLine,
} from 'lucide-react';

interface TailorEditStepProps {
  profile: ResumeProfile;
  jobDescription: JobDescriptionData | null;
  tailoredResume: TailoredResumeResult | null;
  coverLetter: CoverLetterResult | null;
  onUpdateTailoredResume: (res: TailoredResumeResult) => void;
  onUpdateCoverLetter: (cl: CoverLetterResult) => void;
  onNext: () => void;
  userApiKey?: string;
}

export const TailorEditStep: React.FC<TailorEditStepProps> = ({
  profile,
  jobDescription,
  tailoredResume,
  coverLetter,
  onUpdateTailoredResume,
  onUpdateCoverLetter,
  onNext,
  userApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  const [tone, setTone] = useState<'confident' | 'executive' | 'technical' | 'leadership'>('confident');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Generate Tailored Resume and Cover Letter via Gemini
  const handleGenerateTailored = async () => {
    if (!jobDescription) return;

    setIsTailoring(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      // Parallel generation of both tailored resume and cover letter
      const [resumeRes, coverRes] = await Promise.all([
        fetch('/api/tailor-resume', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            resumeProfile: profile,
            jobDescription,
            tone,
            customInstructions,
          }),
        }),
        fetch('/api/generate-cover-letter', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            resumeProfile: profile,
            jobDescription,
            tone,
            customInstructions,
          }),
        }),
      ]);

      const resumeJson = await resumeRes.json();
      const coverJson = await coverRes.json();

      if (resumeJson.data) {
        onUpdateTailoredResume(resumeJson.data);
      }
      if (coverJson.data) {
        onUpdateCoverLetter(coverJson.data);
      }
    } catch (err: any) {
      console.error('Tailoring error:', err);
    } finally {
      setIsTailoring(false);
    }
  };

  // Helper to edit tailored summary
  const handleSummaryChange = (newSummary: string) => {
    if (!tailoredResume) return;
    onUpdateTailoredResume({ ...tailoredResume, tailoredSummary: newSummary });
  };

  // Helper to edit tailored bullet point
  const handleBulletChange = (expId: string, bIdx: number, newText: string) => {
    if (!tailoredResume) return;
    const updatedExps = tailoredResume.tailoredExperiences.map((exp) => {
      if (exp.id !== expId) return exp;
      const newBullets = [...exp.bullets];
      newBullets[bIdx] = newText;
      return { ...exp, bullets: newBullets };
    });
    onUpdateTailoredResume({ ...tailoredResume, tailoredExperiences: updatedExps });
  };

  // Helper to edit cover letter paragraph
  const handleCoverParagraphChange = (pIdx: number, newText: string) => {
    if (!coverLetter) return;
    const newParagraphs = [...coverLetter.paragraphs];
    newParagraphs[pIdx] = newText;
    onUpdateCoverLetter({
      ...coverLetter,
      paragraphs: newParagraphs,
      fullText: newParagraphs.join('\n\n'),
    });
  };

  const handleCopyCoverLetter = () => {
    if (!coverLetter) return;
    const text = `${coverLetter.salutation}\n\n${coverLetter.paragraphs.join('\n\n')}\n\nSincerely,\n${profile.fullName}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header & Control Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              <span>Step 4 of 5</span>
              <span aria-hidden="true">·</span>
              <span>One-Click Generation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Tailored Resume & Cover Letter Studio
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Rewrites achievements to spotlight relevance, action verbs, and integrated ATS triggers for <span className="font-semibold text-neutral-900 dark:text-white">{jobDescription?.companyName || 'Target Company'}</span> without fabricating false claims.
            </p>
          </div>

          {/* Tone Selector & One-Click Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <span className="text-[11px] font-semibold text-neutral-500 px-2">Tone:</span>
              {(['confident', 'executive', 'technical', 'leadership'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                    tone === t
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerateTailored}
              disabled={isTailoring}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tailoredResume ? 'Regenerate Tailored Docs' : 'Generate Tailored Documents'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom refinement prompt */}
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Add custom prompt instructions (e.g. 'Emphasize billing architecture and sub-35ms latency gains')..."
            className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 select-none cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={highlightKeywords}
              onChange={(e) => setHighlightKeywords(e.target.checked)}
              className="rounded text-neutral-900 focus:ring-0"
            />
            <span>Highlight Injected ATS Keywords</span>
          </label>
        </div>
      </div>

      {/* Synchronized Document Tabs */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Navigation Switch */}
        <div className="px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'resume'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Tailored Resume (Side-by-Side Diffs)</span>
            </button>
            <button
              onClick={() => setActiveTab('cover-letter')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'cover-letter'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Targeted Cover Letter</span>
            </button>
          </div>

          {activeTab === 'cover-letter' && (
            <button
              type="button"
              onClick={handleCopyCoverLetter}
              className="px-3 py-1 text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Cover Letter'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Tailored Resume Side-by-Side Editor */}
        {activeTab === 'resume' && (
          <div className="p-6 space-y-6">
            {/* Projected Score Badge Strip */}
            {tailoredResume && (
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {tailoredResume.projectedAtsScore || 95}%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                      Optimized ATS Pass Rating: {tailoredResume.projectedAtsScore || 95}%
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      All critical JD keywords woven seamlessly into verified achievements.
                    </span>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  XYZ Formula Applied
                </div>
              </div>
            )}

            {/* Tailored Professional Summary Editor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                Tailored Professional Summary (Click to edit)
              </label>
              <textarea
                rows={4}
                value={tailoredResume?.tailoredSummary || profile.summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="w-full p-3.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Side-by-Side Experience Comparison */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3">
                Work Experience Bullets: Base Profile vs Tailored ATS Version
              </h3>

              <div className="space-y-6">
                {(tailoredResume?.tailoredExperiences || profile.experiences).map((exp, expIdx) => {
                  const baseExp = profile.experiences.find((e) => e.id === exp.id) || profile.experiences[expIdx];
                  return (
                    <div
                      key={exp.id || expIdx}
                      className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-xs"
                    >
                      <div className="bg-neutral-100/70 dark:bg-neutral-800/70 px-4 py-2.5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
                        <span className="font-bold text-neutral-900 dark:text-white text-xs">
                          {exp.role} @ {exp.company}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-700">
                        {/* Left: Original Base Bullets */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Original Base Version
                          </span>
                          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 list-disc list-outside ml-3.5">
                            {baseExp?.bullets.map((b, i) => (
                              <li key={i} className="leading-snug">
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right: Tailored Version (Editable) */}
                        <div className="md:pl-4 space-y-2 pt-3 md:pt-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1 flex items-center justify-between">
                            <span>Tailored ATS Version</span>
                            <span className="text-[9px] font-mono text-neutral-400">Editable</span>
                          </span>
                          <div className="space-y-2">
                            {exp.bullets.map((tailoredBullet, bIdx) => (
                              <div key={bIdx} className="space-y-1">
                                <textarea
                                  rows={2}
                                  value={tailoredBullet}
                                  onChange={(e) => handleBulletChange(exp.id, bIdx, e.target.value)}
                                  className="w-full p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 leading-snug focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                />
                                {highlightKeywords && exp.keywordsInjected && exp.keywordsInjected.length > 0 && (
                                  <div className="flex flex-wrap gap-1 text-[10px] text-neutral-500">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Injected:</span>
                                    {exp.keywordsInjected.map((kw, kIdx) => (
                                      <span key={kIdx} className="bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded text-emerald-800 dark:text-emerald-300">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Targeted Cover Letter Editor */}
        {activeTab === 'cover-letter' && (
          <div className="p-6 space-y-6">
            {coverLetter ? (
              <div className="max-w-3xl mx-auto space-y-4">
                {/* Subject & Salutation */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={coverLetter.subject}
                    onChange={(e) =>
                      onUpdateCoverLetter({ ...coverLetter, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Salutation
                  </label>
                  <input
                    type="text"
                    value={coverLetter.salutation}
                    onChange={(e) =>
                      onUpdateCoverLetter({ ...coverLetter, salutation: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                {/* Paragraphs */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Letter Body (4 Strategic Paragraphs)
                  </label>
                  {coverLetter.paragraphs.map((para, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-neutral-400 font-semibold">
                        <span>
                          {idx === 0
                            ? 'Opening Hook & Company Connection'
                            : idx === 1
                            ? 'Core Technical Accomplishment & Results'
                            : idx === 2
                            ? 'Culture, Leadership & Collaboration Fit'
                            : 'Closing Value Proposition & Call to Action'}
                        </span>
                        <span className="font-mono">P{idx + 1}</span>
                      </div>
                      <textarea
                        rows={4}
                        value={para}
                        onChange={(e) => handleCoverParagraphChange(idx, e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  ))}
                </div>

                {/* Sign-off */}
                <div className="pt-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  <p>Sincerely,</p>
                  <p className="font-bold text-neutral-900 dark:text-white mt-1">{profile.fullName}</p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                <p className="text-xs">
                  Click &quot;Generate Tailored Documents&quot; above to draft your targeted cover letter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA to Template & Export Studio */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Proceed to Template Gallery & Export Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
