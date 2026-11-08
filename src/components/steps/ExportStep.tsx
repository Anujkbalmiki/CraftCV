import React, { useState, useRef } from 'react';
import {
  ResumeProfile,
  JobDescriptionData,
  TailoredResumeResult,
  CoverLetterResult,
  ResumeTemplateId,
  ApplicationRecord,
} from '../../types';
import { RESUME_TEMPLATES } from '../../data/mockData';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  Copy,
  LayoutTemplate,
  BookmarkCheck,
  Check,
  FileText,
  FileCheck2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ExportStepProps {
  profile: ResumeProfile;
  jobDescription: JobDescriptionData | null;
  tailoredResume: TailoredResumeResult | null;
  coverLetter: CoverLetterResult | null;
  selectedTemplateId: ResumeTemplateId;
  onSelectTemplate: (id: ResumeTemplateId) => void;
  onOpenTemplateGallery: () => void;
  onSaveToTracker: (record: ApplicationRecord) => void;
  onGoToTracker: () => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  profile,
  jobDescription,
  tailoredResume,
  coverLetter,
  selectedTemplateId,
  onSelectTemplate,
  onOpenTemplateGallery,
  onSaveToTracker,
  onGoToTracker,
}) => {
  const [activeDocument, setActiveDocument] = useState<'resume' | 'cover-letter'>('resume');
  const [copiedNotification, setCopiedNotification] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  // Trigger Native Print / PDF Download
  const handlePrint = () => {
    window.print();
  };

  // Generate and Download DOCX / Text format
  const handleDownloadDocx = () => {
    const summary = tailoredResume?.tailoredSummary || profile.summary;
    const experiences = tailoredResume?.tailoredExperiences || profile.experiences;
    const skills = tailoredResume?.tailoredSkills || profile.skills;

    let content = `${profile.fullName.toUpperCase()}\n`;
    content += `${tailoredResume?.tailoredHeadline || profile.headline}\n`;
    content += `${profile.email} | ${profile.phone} | ${profile.location}\n`;
    if (profile.linkedin) content += `${profile.linkedin}\n`;
    content += `\n=========================================\n`;
    content += `PROFESSIONAL SUMMARY\n`;
    content += `=========================================\n${summary}\n\n`;
    content += `=========================================\n`;
    content += `CORE TECHNICAL SKILLS\n`;
    content += `=========================================\n`;
    content += `Languages & Frameworks: ${skills.technical.join(', ')}\n`;
    content += `Systems & Tools: ${skills.tools.join(', ')}\n`;
    content += `Leadership & Methods: ${skills.soft.join(', ')}\n\n`;
    content += `=========================================\n`;
    content += `PROFESSIONAL EXPERIENCE\n`;
    content += `=========================================\n`;

    experiences.forEach((exp) => {
      content += `\n${exp.role} | ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
      exp.bullets.forEach((b) => {
        content += `• ${b}\n`;
      });
    });

    content += `\n=========================================\n`;
    content += `EDUCATION\n`;
    content += `=========================================\n`;
    profile.education.forEach((edu) => {
      content += `${edu.institution} - ${edu.degree} (${edu.gradYear})\n`;
    });

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.fullName.replace(/\s+/g, '_')}_Tailored_Resume.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy Clean Markdown
  const handleCopyMarkdown = () => {
    const summary = tailoredResume?.tailoredSummary || profile.summary;
    const experiences = tailoredResume?.tailoredExperiences || profile.experiences;
    const skills = tailoredResume?.tailoredSkills || profile.skills;

    let md = `# ${profile.fullName}\n`;
    md += `**${tailoredResume?.tailoredHeadline || profile.headline}**\n\n`;
    md += `${profile.email} · ${profile.phone} · ${profile.location}\n\n`;
    md += `## Professional Summary\n${summary}\n\n`;
    md += `## Skills\n- **Technical:** ${skills.technical.join(', ')}\n- **Tools:** ${skills.tools.join(', ')}\n\n`;
    md += `## Experience\n`;
    experiences.forEach((exp) => {
      md += `### ${exp.role} — ${exp.company} *(${exp.startDate} - ${exp.endDate})*\n`;
      exp.bullets.forEach((b) => {
        md += `- ${b}\n`;
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedNotification('Markdown copied to clipboard!');
    setTimeout(() => setCopiedNotification(''), 2500);
  };

  // Save to Application Tracker with Confetti
  const handleSaveApplication = () => {
    if (!jobDescription) return;

    const record: ApplicationRecord = {
      id: `app-${Date.now()}`,
      companyName: jobDescription.companyName || 'Company',
      role: jobDescription.jobTitle || 'Role',
      date: new Date().toISOString().split('T')[0],
      matchScore: tailoredResume?.projectedAtsScore || 94,
      status: 'Saved',
      jobDescription,
      tailoredResume: tailoredResume || {
        tailoredSummary: profile.summary,
        tailoredHeadline: profile.headline,
        tailoredExperiences: profile.experiences,
        tailoredSkills: profile.skills,
        tailoredProjects: profile.projects,
        alignmentHighlights: [],
        projectedAtsScore: 92,
      },
      coverLetter: coverLetter || undefined,
    };

    onSaveToTracker(record);
    setIsSaved(true);

    // Fire celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="no-print bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              <span>Step 5 of 5</span>
              <span aria-hidden="true">·</span>
              <span>Template Gallery & Multi-Export</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Export Studio & Application Tracker
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Select among 7 recruiter-validated templates, preview formatting in real time, and download ATS-friendly PDF or DOCX documents.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-2 transition-colors shadow-sm"
              title="Print to PDF via browser print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download ATS PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDocx}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX Format</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedNotification || 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveApplication}
              disabled={isSaved}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs ${
                isSaved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved to Tracker!' : 'Save to Tracker'}</span>
            </button>
          </div>
        </div>

        {/* Quick Horizontal Template Carousel */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5" /> Select Resume Template (7 Available)
            </span>
            <button
              type="button"
              onClick={onOpenTemplateGallery}
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:underline flex items-center gap-1"
            >
              View Full Gallery & ATS Scores <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {RESUME_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onSelectTemplate(tmpl.id)}
                  className={`px-3 py-2 text-xs rounded-xl border text-left shrink-0 transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                    <span>{tmpl.name}</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'}`}>
                    {tmpl.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Document Toggle: Resume vs Cover Letter */}
      <div className="no-print flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveDocument('resume')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeDocument === 'resume'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Tailored Resume Document</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDocument('cover-letter')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeDocument === 'cover-letter'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Matching Cover Letter</span>
          </button>
        </div>

        {isSaved && (
          <button
            type="button"
            onClick={onGoToTracker}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View in Application Tracker <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Document Live Preview Sheet */}
      <div
        ref={printContainerRef}
        className="bg-neutral-200/70 dark:bg-neutral-950 p-4 sm:p-8 rounded-2xl border border-neutral-300 dark:border-neutral-800 shadow-inner flex justify-center"
      >
        {activeDocument === 'resume' ? (
          <ResumeRenderer
            profile={profile}
            tailored={tailoredResume}
            templateId={selectedTemplateId}
            highlightKeywords={false}
          />
        ) : (
          <div className="resume-sheet bg-white text-neutral-900 p-10 font-sans text-[13px] leading-relaxed max-w-[800px] w-full shadow-sm space-y-5">
            {/* Cover Letter Header */}
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-xl font-bold text-neutral-900">{profile.fullName}</h1>
              <p className="text-xs text-neutral-600 mt-0.5">{profile.headline}</p>
              <div className="text-xs text-neutral-500 mt-2">
                {profile.email} · {profile.phone} · {profile.location}
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            <div className="text-xs font-semibold text-neutral-900">
              Hiring Team for {jobDescription?.jobTitle || 'Target Position'}
              <br />
              {jobDescription?.companyName || 'Target Company'}
            </div>

            <div className="text-xs font-bold text-neutral-900 pt-2">
              RE: {coverLetter?.subject || `Application for ${jobDescription?.jobTitle}`}
            </div>

            <p className="text-xs font-semibold text-neutral-900">
              {coverLetter?.salutation || `Dear ${jobDescription?.companyName || 'Hiring'} Team,`}
            </p>

            {/* Paragraphs */}
            <div className="space-y-4 text-neutral-800 text-[13px] leading-relaxed">
              {(coverLetter?.paragraphs || [
                `I am writing to express my strong enthusiasm for the ${jobDescription?.jobTitle || 'role'} at ${jobDescription?.companyName || 'your company'}.`,
                `Throughout my engineering career, I have focused on building resilient high-throughput systems that directly translate to business velocity.`,
                `I look forward to discussing how my experience can contribute to your engineering objectives.`,
              ]).map((p, idx) => (
                <p key={idx} className="text-justify">
                  {p}
                </p>
              ))}
            </div>

            <div className="pt-4 text-xs">
              <p>Sincerely,</p>
              <p className="font-bold text-neutral-900 text-sm mt-1">{profile.fullName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
