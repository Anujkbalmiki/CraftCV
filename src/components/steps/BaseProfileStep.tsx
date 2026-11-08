import React, { useState, useRef } from 'react';
import {
  ResumeProfile,
  ExperienceItem,
  ProjectItem,
} from '../../types';
import { INITIAL_BASE_PROFILE } from '../../data/mockData';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Check,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase,
  Layers,
  GraduationCap,
  FolderGit2,
} from 'lucide-react';

interface BaseProfileStepProps {
  profile: ResumeProfile;
  onUpdateProfile: (profile: ResumeProfile) => void;
  onNext: () => void;
  userApiKey?: string;
}

export const BaseProfileStep: React.FC<BaseProfileStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  userApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'ai-parser'>('editor');
  const [editorSection, setEditorSection] = useState<'contact' | 'experience' | 'skills' | 'projects' | 'education'>('contact');
  const [resumeTextToParse, setResumeTextToParse] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse text or document with Gemini
  const handleParseResume = async (text: string) => {
    if (!text.trim()) {
      setParseError('Please provide text from your resume.');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeText: text }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to parse resume.');
      }

      onUpdateProfile(json.data);
      setActiveTab('editor');
    } catch (err: any) {
      setParseError(err.message || 'Error parsing resume text.');
    } finally {
      setIsParsing(false);
    }
  };

  // Handle file drop for resume parsing
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setResumeTextToParse(content);
      handleParseResume(content);
    };
    reader.readAsText(file);
  };

  // Add new experience
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'New Company Inc.',
      role: 'Software Engineer',
      location: 'Remote',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded key engineering initiatives and delivered high-impact software features.',
      ],
    };
    onUpdateProfile({
      ...profile,
      experiences: [newExp, ...profile.experiences],
    });
  };

  // Remove experience
  const handleRemoveExperience = (id: string) => {
    onUpdateProfile({
      ...profile,
      experiences: profile.experiences.filter((e) => e.id !== id),
    });
  };

  // Update experience field
  const handleUpdateExpField = (id: string, field: keyof ExperienceItem, value: any) => {
    const updated = profile.experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdateProfile({ ...profile, experiences: updated });
  };

  // Bullet edit
  const handleUpdateBullet = (expId: string, bulletIdx: number, newText: string) => {
    const updated = profile.experiences.map((exp) => {
      if (exp.id !== expId) return exp;
      const newBullets = [...exp.bullets];
      newBullets[bulletIdx] = newText;
      return { ...exp, bullets: newBullets };
    });
    onUpdateProfile({ ...profile, experiences: updated });
  };

  // Add bullet
  const handleAddBullet = (expId: string) => {
    const updated = profile.experiences.map((exp) => {
      if (exp.id !== expId) return exp;
      return { ...exp, bullets: [...exp.bullets, 'New measurable accomplishment...'] };
    });
    onUpdateProfile({ ...profile, experiences: updated });
  };

  // Remove bullet
  const handleRemoveBullet = (expId: string, bulletIdx: number) => {
    const updated = profile.experiences.map((exp) => {
      if (exp.id !== expId) return exp;
      return { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIdx) };
    });
    onUpdateProfile({ ...profile, experiences: updated });
  };

  // Reset to default sample profile
  const handleResetSample = () => {
    onUpdateProfile(INITIAL_BASE_PROFILE);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              <span>Step 2 of 5</span>
              <span aria-hidden="true">·</span>
              <span>Persistent Career Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Base Profile & Career History
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              This master profile serves as your single source of truth. Craft-CV tailors these verified achievements for each job without ever making things up.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetSample}
              className="px-3.5 py-1.5 text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors"
            >
              Reset to Sample Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'editor' ? 'ai-parser' : 'editor')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeTab === 'editor' ? 'AI Resume Parser' : 'Structured Editor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Resume Parser Tab */}
      {activeTab === 'ai-parser' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Upload or Paste Resume for Instant Parsing
            </h2>
            <button
              onClick={() => setActiveTab('editor')}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Back to Editor
            </button>
          </div>

          {parseError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/40 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <Upload className="w-8 h-8 text-neutral-400 mb-2" />
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                Upload Resume Document
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Plain text, Markdown, or exported doc
              </p>
            </div>

            {/* Paste Raw Text */}
            <div className="space-y-2">
              <textarea
                rows={6}
                value={resumeTextToParse}
                onChange={(e) => setResumeTextToParse(e.target.value)}
                placeholder="Or paste your existing resume text here..."
                className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-mono"
              />
              <button
                type="button"
                onClick={() => handleParseResume(resumeTextToParse)}
                disabled={isParsing}
                className="w-full py-2 px-3 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Parsing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Parse Into Structured Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structured Tabbed Editor */}
      {activeTab === 'editor' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Sub Navigation Bar */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 overflow-x-auto">
            <button
              onClick={() => setEditorSection('contact')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                editorSection === 'contact'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Contact & Summary
            </button>
            <button
              onClick={() => setEditorSection('experience')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                editorSection === 'experience'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Experience ({profile.experiences?.length || 0})
            </button>
            <button
              onClick={() => setEditorSection('skills')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                editorSection === 'skills'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Skills & Tools
            </button>
            <button
              onClick={() => setEditorSection('projects')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                editorSection === 'projects'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" /> Projects ({profile.projects?.length || 0})
            </button>
            <button
              onClick={() => setEditorSection('education')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                editorSection === 'education'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </button>
          </div>

          <div className="p-6">
            {/* Section 1: Contact & Summary */}
            {editorSection === 'contact' && (
              <div className="space-y-4 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => onUpdateProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={profile.headline}
                      onChange={(e) => onUpdateProfile({ ...profile, headline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => onUpdateProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => onUpdateProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => onUpdateProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={profile.linkedin || ''}
                      onChange={(e) => onUpdateProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Master Executive Summary
                  </label>
                  <textarea
                    rows={4}
                    value={profile.summary}
                    onChange={(e) => onUpdateProfile({ ...profile, summary: e.target.value })}
                    className="w-full p-3 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Section 2: Experience */}
            {editorSection === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">
                    Roles and measurable achievements
                  </span>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Role
                  </button>
                </div>

                <div className="space-y-6">
                  {profile.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/40 dark:bg-neutral-950/30 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-medium text-neutral-500 mb-1">Role Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExpField(exp.id, 'role', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-500 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExpField(exp.id, 'company', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                          />
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex-1 mr-2">
                            <label className="block text-[11px] font-medium text-neutral-500 mb-1">Dates</label>
                            <input
                              type="text"
                              value={`${exp.startDate} - ${exp.endDate}`}
                              onChange={(e) => {
                                const parts = e.target.value.split('-');
                                handleUpdateExpField(exp.id, 'startDate', parts[0]?.trim() || '');
                                handleUpdateExpField(exp.id, 'endDate', parts[1]?.trim() || '');
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                            title="Remove role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Bullet points */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                            Bullet Points (Google XYZ formula recommended)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddBullet(exp.id)}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {exp.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="text-neutral-400 text-xs">•</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                                className="flex-1 px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveBullet(exp.id, bIdx)}
                                className="p-1 text-neutral-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Skills */}
            {editorSection === 'skills' && (
              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Technical Skills & Languages (Comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={profile.skills.technical.join(', ')}
                    onChange={(e) =>
                      onUpdateProfile({
                        ...profile,
                        skills: {
                          ...profile.skills,
                          technical: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Cloud, Platforms & Developer Tools (Comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={profile.skills.tools.join(', ')}
                    onChange={(e) =>
                      onUpdateProfile({
                        ...profile,
                        skills: {
                          ...profile.skills,
                          tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Leadership & Methodologies (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={profile.skills.soft.join(', ')}
                    onChange={(e) =>
                      onUpdateProfile({
                        ...profile,
                        skills: {
                          ...profile.skills,
                          soft: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                  />
                </div>
              </div>
            )}

            {/* Section 4: Projects */}
            {editorSection === 'projects' && (
              <div className="space-y-4 max-w-3xl">
                {profile.projects.map((proj, pIdx) => (
                  <div key={proj.id} className="p-4 border rounded-xl border-neutral-200 dark:border-neutral-700 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...profile.projects];
                          updated[pIdx].name = e.target.value;
                          onUpdateProfile({ ...profile, projects: updated });
                        }}
                        placeholder="Project Name"
                        className="px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                      />
                      <input
                        type="text"
                        value={proj.link || ''}
                        onChange={(e) => {
                          const updated = [...profile.projects];
                          updated[pIdx].link = e.target.value;
                          onUpdateProfile({ ...profile, projects: updated });
                        }}
                        placeholder="Project Link (github.com/...)"
                        className="px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...profile.projects];
                        updated[pIdx].description = e.target.value;
                        onUpdateProfile({ ...profile, projects: updated });
                      }}
                      placeholder="Brief description"
                      className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section 5: Education */}
            {editorSection === 'education' && (
              <div className="space-y-4 max-w-3xl">
                {profile.education.map((edu, eIdx) => (
                  <div key={edu.id} className="p-4 border rounded-xl border-neutral-200 dark:border-neutral-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...profile.education];
                        updated[eIdx].institution = e.target.value;
                        onUpdateProfile({ ...profile, education: updated });
                      }}
                      placeholder="Institution"
                      className="px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...profile.education];
                        updated[eIdx].degree = e.target.value;
                        onUpdateProfile({ ...profile, education: updated });
                      }}
                      placeholder="Degree"
                      className="px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                    />
                    <input
                      type="text"
                      value={edu.gradYear}
                      onChange={(e) => {
                        const updated = [...profile.education];
                        updated[eIdx].gradYear = e.target.value;
                        onUpdateProfile({ ...profile, education: updated });
                      }}
                      placeholder="Grad Year"
                      className="px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 font-mono"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Next button */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Analyze ATS Match Score</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
