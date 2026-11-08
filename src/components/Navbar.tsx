import React from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Sliders,
  LayoutTemplate,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  activeStep: number;
  onSelectStep: (step: number) => void;
  onOpenTour: () => void;
  onOpenTemplates: () => void;
  onOpenSettings: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  savedApplicationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeStep,
  onSelectStep,
  onOpenTour,
  onOpenTemplates,
  onOpenSettings,
  isDark,
  onToggleTheme,
  savedApplicationsCount,
}) => {
  const navItems = [
    { step: 1, label: '1. Job Ingest' },
    { step: 2, label: '2. Base Profile' },
    { step: 3, label: '3. ATS Match' },
    { step: 4, label: '4. Tailor & Edit' },
    { step: 5, label: '5. Export' },
    { step: 6, label: `Tracker (${savedApplicationsCount})` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectStep(1)}
            className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              CV
            </div>
            <span>Craft-CV</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, 1-2 words) */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 shrink-0">
          {navItems.map((item) => {
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                onClick={() => onSelectStep(item.step)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Tour Button */}
          <button
            type="button"
            onClick={onOpenTour}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            title="Interactive Onboarding Guide"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* Templates Gallery Button */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap bg-white dark:bg-neutral-900 shadow-xs"
            title="Explore 7 Resume Templates"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span className="hidden sm:inline">Templates (7)</span>
          </button>

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Settings & Gemini API"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Dark/Light mode toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
        </div>
      </div>

      {/* Mobile sub-bar stepper */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
        {navItems.map((item) => (
          <button
            key={item.step}
            onClick={() => onSelectStep(item.step)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeStep === item.step
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
