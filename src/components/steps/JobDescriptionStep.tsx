import React, { useState, useRef } from 'react';
import {
  JobDescriptionData,
  AtsKeyword,
} from '../../types';
import { SAMPLE_PRESET_JDS } from '../../data/mockData';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Building2,
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface JobDescriptionStepProps {
  jobDescription: JobDescriptionData | null;
  onUpdateJobDescription: (jd: JobDescriptionData) => void;
  onNext: () => void;
  userApiKey?: string;
}

export const JobDescriptionStep: React.FC<JobDescriptionStepProps> = ({
  jobDescription,
  onUpdateJobDescription,
  onNext,
  userApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'text'>('screenshot');
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(jobDescription?.screenshotUrl || null);
  const [rawText, setRawText] = useState(jobDescription?.rawText || '');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
      processScreenshot(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const processScreenshot = async (imageBase64: string, mimeType: string) => {
    setIsLoading(true);
    setLoadingPhase('Uploading screenshot to Gemini Vision...');
    setError(null);

    try {
      const timer1 = setTimeout(() => {
        setLoadingPhase('Gemini Vision OCR analyzing job title, tech stack & requirements...');
      }, 1200);

      const timer2 = setTimeout(() => {
        setLoadingPhase('Extracting high-priority ATS keyword triggers & competencies...');
      }, 2600);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      const res = await fetch('/api/extract-jd', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageBase64,
          mimeType,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to extract job description from image.');
      }

      const data: JobDescriptionData = {
        ...json.data,
        screenshotUrl: imageBase64,
        atsKeywords: (json.data.atsKeywords || []).map((k: any) => ({
          ...k,
          selected: true,
        })),
      };

      onUpdateJobDescription(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error processing screenshot. Please check your network or API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessText = async () => {
    if (!rawText.trim()) {
      setError('Please enter or paste the Job Description text.');
      return;
    }

    setIsLoading(true);
    setLoadingPhase('Parsing raw Job Description with Gemini...');
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      const res = await fetch('/api/extract-jd', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: rawText,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to extract job details.');
      }

      const data: JobDescriptionData = {
        ...json.data,
        rawText,
        atsKeywords: (json.data.atsKeywords || []).map((k: any) => ({
          ...k,
          selected: true,
        })),
      };

      onUpdateJobDescription(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error parsing text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle keyword selection
  const handleToggleKeyword = (keywordName: string) => {
    if (!jobDescription) return;
    const updated = jobDescription.atsKeywords.map((k) =>
      k.keyword === keywordName ? { ...k, selected: !k.selected } : k
    );
    onUpdateJobDescription({ ...jobDescription, atsKeywords: updated });
  };

  // Add custom keyword
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim() || !jobDescription) return;

    const trimmed = newKeywordInput.trim();
    if (jobDescription.atsKeywords.some((k) => k.keyword.toLowerCase() === trimmed.toLowerCase())) {
      setNewKeywordInput('');
      return;
    }

    const newKeyword: AtsKeyword = {
      keyword: trimmed,
      priority: 'high',
      category: 'technical',
      selected: true,
    };

    onUpdateJobDescription({
      ...jobDescription,
      atsKeywords: [newKeyword, ...jobDescription.atsKeywords],
    });
    setNewKeywordInput('');
  };

  // Load a preset
  const handleLoadPreset = (preset: (typeof SAMPLE_PRESET_JDS)[0]) => {
    setPreviewImage(null);
    setRawText(preset.data.rawText || '');
    onUpdateJobDescription(preset.data);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Hero Strip */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            <span>Step 1 of 5</span>
            <span aria-hidden="true">·</span>
            <span>Multimodal Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Ingest Target Job Description
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            Upload a screenshot from LinkedIn, Indeed, or any career page. Gemini Vision extracts the technical stack, core behavioral expectations, and ATS keyword triggers instantly.
          </p>
        </div>

        {/* Quick presets bar */}
        <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Quick 1-Click Presets:
          </span>
          {SAMPLE_PRESET_JDS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-neutral-500" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload Area & Extracted Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload / Paste (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            {/* Input type switch */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('screenshot')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'screenshot'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Screenshot Image
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'text'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Paste Raw Text
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="p-8 text-center space-y-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700 animate-pulse">
                <RefreshCw className="w-7 h-7 text-neutral-800 dark:text-neutral-200 mx-auto animate-spin" />
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {loadingPhase}
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Powered by gemini-3.8-flash Multimodal API
                </div>
              </div>
            )}

            {!isLoading && activeTab === 'screenshot' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    dragActive
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/50'
                  }`}
                >
                  {previewImage ? (
                    <div className="space-y-3 w-full">
                      <div className="relative max-h-40 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <img
                          src={previewImage}
                          alt="JD Screenshot preview"
                          className="w-full object-cover object-top"
                        />
                      </div>
                      <p className="text-xs text-neutral-500">
                        Click or drag new screenshot to re-analyze
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        Drop Job Description screenshot here
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        PNG, JPG, or WEBP up to 20MB
                      </p>
                      <button
                        type="button"
                        className="mt-3 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                      >
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {!isLoading && activeTab === 'text' && (
              <div className="space-y-3">
                <textarea
                  rows={9}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste the full job posting text here (including responsibilities, qualifications, and company overview)..."
                  className="w-full p-3.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all font-mono leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleProcessText}
                  className="w-full py-2.5 px-4 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" /> Extract Job Requirements with Gemini
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Extracted Structured Information (7 cols) */}
        <div className="lg:col-span-7">
          {jobDescription ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header Info */}
              <div className="border-b border-neutral-100 dark:border-neutral-800 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Successfully Extracted
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {jobDescription.atsKeywords?.length || 0} ATS triggers detected
                  </span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  {jobDescription.jobTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {jobDescription.companyName}
                  </span>
                  {jobDescription.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {jobDescription.location}
                    </span>
                  )}
                  {jobDescription.experienceRequired && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {jobDescription.experienceRequired}
                    </span>
                  )}
                </div>
              </div>

              {/* Interactive ATS Keywords / Tag Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    High-Priority ATS Keywords (Click to toggle)
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    {jobDescription.atsKeywords.filter((k) => k.selected).length} Active for Tailoring
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {jobDescription.atsKeywords.map((kw, idx) => {
                    const isSelected = kw.selected !== false;
                    const isCritical = kw.priority === 'critical';
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleKeyword(kw.keyword)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? isCritical
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                              : 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 line-through opacity-60'
                        }`}
                        title={isCritical ? 'Critical ATS Trigger' : 'Recommended Keyword'}
                      >
                        {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        <span>{kw.keyword}</span>
                        {isCritical && isSelected && (
                          <span className="text-[9px] uppercase font-mono px-1 rounded bg-red-500/80 text-white">
                            ATS
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Keyword */}
                <form onSubmit={handleAddKeyword} className="flex gap-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    placeholder="Add custom keyword (e.g. Next.js, Distributed Systems)..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </form>
              </div>

              {/* Responsibilities & Culture Preview */}
              {jobDescription.keyResponsibilities && jobDescription.keyResponsibilities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Key Job Responsibilities
                  </h3>
                  <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc list-outside ml-4">
                    {jobDescription.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Step CTA */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  type="button"
                  onClick={onNext}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Proceed to Base Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
              <div className="w-12 h-12 rounded-xl bg-neutral-200/60 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Awaiting Job Description
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Upload a screenshot or click one of our 1-click presets above to preview instant ATS extraction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
