import React, { useState, useEffect } from 'react';
import {
  JobDescriptionData,
  ResumeProfile,
  AtsAnalysisResult,
  TailoredResumeResult,
  CoverLetterResult,
  ResumeTemplateId,
  ApplicationRecord,
} from './types';
import {
  INITIAL_BASE_PROFILE,
  SAMPLE_PRESET_JDS,
  INITIAL_SAVED_APPLICATIONS,
  RESUME_TEMPLATES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { JobDescriptionStep } from './components/steps/JobDescriptionStep';
import { BaseProfileStep } from './components/steps/BaseProfileStep';
import { AtsMatchStep } from './components/steps/AtsMatchStep';
import { TailorEditStep } from './components/steps/TailorEditStep';
import { ExportStep } from './components/steps/ExportStep';
import { ApplicationTracker } from './components/tracker/ApplicationTracker';
import { TemplateGalleryModal } from './components/templates/TemplateGalleryModal';
import { OnboardingTour } from './components/onboarding/OnboardingTour';
import { SettingsModal } from './components/settings/SettingsModal';

export default function App() {
  // Step state (1: Job, 2: Profile, 3: Match, 4: Tailor, 5: Export, 6: Tracker)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Persistent user base career profile
  const [baseProfile, setBaseProfile] = useState<ResumeProfile>(() => {
    try {
      const saved = localStorage.getItem('craftcv_base_profile');
      return saved ? JSON.parse(saved) : INITIAL_BASE_PROFILE;
    } catch {
      return INITIAL_BASE_PROFILE;
    }
  });

  // Current active Job Description (initialized with first preset for instant usability)
  const [jobDescription, setJobDescription] = useState<JobDescriptionData | null>(
    SAMPLE_PRESET_JDS[0].data
  );

  // ATS Score analysis
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysisResult | null>(null);

  // Tailored Resume & Cover Letter outputs
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeResult | null>(
    INITIAL_SAVED_APPLICATIONS[0].tailoredResume
  );
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(
    INITIAL_SAVED_APPLICATIONS[0].coverLetter || null
  );

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<ResumeTemplateId>('ats-classic');

  // Tracked Applications list
  const [savedApplications, setSavedApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('craftcv_applications');
      return saved ? JSON.parse(saved) : INITIAL_SAVED_APPLICATIONS;
    } catch {
      return INITIAL_SAVED_APPLICATIONS;
    }
  });

  // User Gemini API Key (Optional custom key)
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem('craftcv_gemini_key') || '';
  });

  // Modals state
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(true);

  // Theme state (Dark/Light)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('craftcv_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync theme class to documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('craftcv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('craftcv_theme', 'light');
    }
  }, [isDark]);

  // Persist base profile
  useEffect(() => {
    try {
      localStorage.setItem('craftcv_base_profile', JSON.stringify(baseProfile));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }, [baseProfile]);

  // Persist applications
  useEffect(() => {
    try {
      localStorage.setItem('craftcv_applications', JSON.stringify(savedApplications));
    } catch (e) {
      console.error('Failed to save applications to localStorage:', e);
    }
  }, [savedApplications]);

  // Check server health on launch
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasServerKey(!!(data.hasApiKey || data.hasServerKey));
      })
      .catch(() => {
        setHasServerKey(true);
      });
  }, []);

  // Save custom key
  const handleSaveApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem('craftcv_gemini_key', key);
  };

  // Add application to tracker
  const handleSaveToTracker = (record: ApplicationRecord) => {
    setSavedApplications((prev) => [record, ...prev.filter((p) => p.id !== record.id)]);
  };

  // Update application status
  const handleUpdateAppStatus = (id: string, status: ApplicationRecord['status']) => {
    setSavedApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  // Delete application
  const handleDeleteApp = (id: string) => {
    setSavedApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // Load application back into tailoring studio
  const handleLoadApp = (record: ApplicationRecord) => {
    setJobDescription(record.jobDescription);
    setTailoredResume(record.tailoredResume);
    if (record.coverLetter) setCoverLetter(record.coverLetter);
    setActiveStep(5); // Go directly to export studio
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Global Top Navbar */}
      <Navbar
        activeStep={activeStep}
        onSelectStep={(step) => setActiveStep(step)}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        savedApplicationsCount={savedApplications.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Step 1: Ingest Job Description */}
        {activeStep === 1 && (
          <JobDescriptionStep
            jobDescription={jobDescription}
            onUpdateJobDescription={(jd) => {
              setJobDescription(jd);
              setAtsAnalysis(null); // Reset analysis on new JD
            }}
            onNext={() => setActiveStep(2)}
            userApiKey={userApiKey}
          />
        )}

        {/* Step 2: Base Career Profile */}
        {activeStep === 2 && (
          <BaseProfileStep
            profile={baseProfile}
            onUpdateProfile={(prof) => setBaseProfile(prof)}
            onNext={() => setActiveStep(3)}
            userApiKey={userApiKey}
          />
        )}

        {/* Step 3: ATS Match & Optimization Radar */}
        {activeStep === 3 && (
          <AtsMatchStep
            profile={baseProfile}
            jobDescription={jobDescription}
            atsAnalysis={atsAnalysis}
            onUpdateAnalysis={(analysis) => setAtsAnalysis(analysis)}
            onNext={() => setActiveStep(4)}
            userApiKey={userApiKey}
          />
        )}

        {/* Step 4: Tailor & Synchronized Editor */}
        {activeStep === 4 && (
          <TailorEditStep
            profile={baseProfile}
            jobDescription={jobDescription}
            tailoredResume={tailoredResume}
            coverLetter={coverLetter}
            onUpdateTailoredResume={(res) => setTailoredResume(res)}
            onUpdateCoverLetter={(cl) => setCoverLetter(cl)}
            onNext={() => setActiveStep(5)}
            userApiKey={userApiKey}
          />
        )}

        {/* Step 5: Template Gallery & Export Studio */}
        {activeStep === 5 && (
          <ExportStep
            profile={baseProfile}
            jobDescription={jobDescription}
            tailoredResume={tailoredResume}
            coverLetter={coverLetter}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={(id) => setSelectedTemplateId(id)}
            onOpenTemplateGallery={() => setIsTemplatesModalOpen(true)}
            onSaveToTracker={handleSaveToTracker}
            onGoToTracker={() => setActiveStep(6)}
          />
        )}

        {/* Step 6: Application Tracker Dashboard */}
        {activeStep === 6 && (
          <ApplicationTracker
            applications={savedApplications}
            onUpdateStatus={handleUpdateAppStatus}
            onDeleteApplication={handleDeleteApp}
            onLoadApplication={handleLoadApp}
            onNewApplication={() => setActiveStep(1)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-neutral-200 dark:border-neutral-800 py-6 px-4 sm:px-6 bg-white dark:bg-neutral-900 text-xs text-neutral-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">Craft-CV</span>
            <span>·</span>
            <span>AI Resume Tailor & Cover Letter Studio</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTourOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Interactive Tour
            </button>
            <button
              onClick={() => setIsTemplatesModalOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              7 Resume Templates
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              API Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <TemplateGalleryModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={(id) => setSelectedTemplateId(id)}
      />

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onGoToStep={(step) => setActiveStep(step)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userApiKey={userApiKey}
        onSaveApiKey={handleSaveApiKey}
        defaultTemplateId={selectedTemplateId}
        onSelectDefaultTemplate={(id) => setSelectedTemplateId(id)}
        hasServerKey={hasServerKey}
      />
    </div>
  );
}
