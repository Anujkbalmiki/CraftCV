import React, { useState } from 'react';
import { ResumeTemplateId, ResumeTemplateMeta } from '../../types';
import { RESUME_TEMPLATES } from '../../data/mockData';
import { Check, Sparkles, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: ResumeTemplateId;
  onSelectTemplate: (templateId: ResumeTemplateId) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'ATS Optimized', 'Executive', 'Tech & Engineering', 'Design & Creative', 'Academic & Finance'];

  const filteredTemplates = selectedCategory === 'All'
    ? RESUME_TEMPLATES
    : RESUME_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                Design System
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Recruiter & ATS Validated
              </span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
              Resume Template Gallery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center gap-2 overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
                className={`group relative rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/10 dark:ring-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 shadow-md'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 hover:shadow-md'
                }`}
              >
                {/* Visual Thumbnail Representation */}
                <div className="w-full h-44 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-950 p-3 mb-3 overflow-hidden relative shadow-inner">
                  {renderMiniaturePreview(template.id)}
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-1 rounded-full shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                    <span className="font-mono text-neutral-600 dark:text-neutral-300">
                      ATS Match: {template.atsCompatibilityScore}%
                    </span>
                    <span className="text-neutral-500 font-medium">
                      {template.badge}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3">
                    {template.description}
                  </p>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Active Template
                    </>
                  ) : (
                    <>
                      Use Template <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <p>
            Templates dynamically adapt fonts, spacing, and structural rules during PDF export without corrupting ATS parseability.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Generates an authentic CSS schematic thumbnail for each template
function renderMiniaturePreview(id: ResumeTemplateId) {
  switch (id) {
    case 'ats-classic':
      return (
        <div className="w-full h-full bg-white dark:bg-neutral-900 p-2 text-[6px] space-y-1.5 font-sans leading-none">
          <div className="text-center border-b border-neutral-300 dark:border-neutral-700 pb-1">
            <div className="h-1.5 bg-neutral-800 dark:bg-neutral-200 w-16 mx-auto rounded-xs mb-0.5"></div>
            <div className="h-1 bg-neutral-400 dark:bg-neutral-500 w-24 mx-auto rounded-xs"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-700 dark:bg-neutral-300 w-10 font-bold"></div>
            <div className="h-0.5 bg-neutral-300 dark:bg-neutral-700 w-full"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-4/5 rounded-xs"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-700 dark:bg-neutral-300 w-12 font-bold"></div>
            <div className="h-0.5 bg-neutral-300 dark:bg-neutral-700 w-full"></div>
            <div className="flex justify-between">
              <div className="h-1 bg-neutral-600 dark:bg-neutral-400 w-14 rounded-xs"></div>
              <div className="h-1 bg-neutral-400 dark:bg-neutral-600 w-6 rounded-xs"></div>
            </div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-11/12 rounded-xs"></div>
          </div>
        </div>
      );
    case 'executive-modern':
      return (
        <div className="w-full h-full bg-white dark:bg-neutral-900 text-[6px] flex flex-col font-sans">
          <div className="bg-[#0f2744] text-white p-2 shrink-0">
            <div className="h-2 bg-white w-20 rounded-xs mb-1"></div>
            <div className="h-1 bg-blue-200 w-28 rounded-xs"></div>
          </div>
          <div className="p-2 space-y-1.5 grow">
            <div className="space-y-0.5">
              <div className="h-1 bg-[#0f2744] dark:bg-blue-300 w-12 font-bold"></div>
              <div className="h-0.5 bg-blue-900/20 dark:bg-blue-400/30 w-full"></div>
              <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-1 bg-[#0f2744] dark:bg-blue-300 w-14 font-bold"></div>
              <div className="h-0.5 bg-blue-900/20 dark:bg-blue-400/30 w-full"></div>
              <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-5/6 rounded-xs"></div>
              <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-4/6 rounded-xs"></div>
            </div>
          </div>
        </div>
      );
    case 'tech-minimal':
      return (
        <div className="w-full h-full bg-[#0d1117] text-neutral-300 p-2 text-[6px] space-y-1.5 font-mono">
          <div className="flex justify-between items-center border-b border-neutral-700 pb-1">
            <div className="h-1.5 bg-emerald-400 w-16 rounded-xs"></div>
            <div className="h-1 bg-neutral-500 w-8 rounded-xs"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-400 w-10"></div>
            <div className="flex gap-1">
              <div className="h-1.5 bg-neutral-800 border border-neutral-700 w-8 rounded-xs"></div>
              <div className="h-1.5 bg-neutral-800 border border-neutral-700 w-8 rounded-xs"></div>
              <div className="h-1.5 bg-neutral-800 border border-neutral-700 w-8 rounded-xs"></div>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-400 w-12"></div>
            <div className="h-1 bg-neutral-600 w-full rounded-xs"></div>
            <div className="h-1 bg-neutral-600 w-3/4 rounded-xs"></div>
          </div>
        </div>
      );
    case 'nordic-clean':
      return (
        <div className="w-full h-full bg-[#fcfbfa] dark:bg-neutral-900 p-2 text-[6px] space-y-2 font-sans">
          <div className="pt-1">
            <div className="h-2 bg-neutral-900 dark:bg-neutral-100 w-20 rounded-xs mb-1"></div>
            <div className="h-1 bg-neutral-400 dark:bg-neutral-500 w-16 rounded-xs"></div>
          </div>
          <div className="space-y-0.5 pt-1">
            <div className="h-1 bg-neutral-500 w-8 uppercase tracking-widest"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-5/6 rounded-xs"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-500 w-10 uppercase tracking-widest"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-11/12 rounded-xs"></div>
          </div>
        </div>
      );
    case 'sidebar-split':
      return (
        <div className="w-full h-full flex text-[6px] font-sans">
          {/* Left Column */}
          <div className="w-[35%] bg-neutral-200 dark:bg-neutral-800 p-1.5 space-y-1.5 border-r border-neutral-300 dark:border-neutral-700">
            <div className="h-1.5 bg-neutral-800 dark:bg-neutral-200 w-10 rounded-xs"></div>
            <div className="h-1 bg-neutral-500 w-12 rounded-xs"></div>
            <div className="pt-1 space-y-0.5">
              <div className="h-1 bg-neutral-700 dark:bg-neutral-300 w-8"></div>
              <div className="h-1 bg-neutral-400 dark:bg-neutral-600 w-10 rounded-xs"></div>
              <div className="h-1 bg-neutral-400 dark:bg-neutral-600 w-9 rounded-xs"></div>
            </div>
            <div className="pt-1 space-y-0.5">
              <div className="h-1 bg-neutral-700 dark:bg-neutral-300 w-8"></div>
              <div className="h-1 bg-neutral-400 dark:bg-neutral-600 w-11 rounded-xs"></div>
            </div>
          </div>
          {/* Right Column */}
          <div className="w-[65%] bg-white dark:bg-neutral-900 p-1.5 space-y-1.5">
            <div className="space-y-0.5">
              <div className="h-1 bg-neutral-800 dark:bg-neutral-200 w-12"></div>
              <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
              <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-4/5 rounded-xs"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-1 bg-neutral-800 dark:bg-neutral-200 w-14"></div>
              <div className="h-1 bg-neutral-400 dark:bg-neutral-600 w-10 rounded-xs"></div>
              <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
            </div>
          </div>
        </div>
      );
    case 'ivy-traditional':
      return (
        <div className="w-full h-full bg-[#fdfdfc] dark:bg-neutral-900 p-2 text-[6px] space-y-1.5 font-serif">
          <div className="text-center pb-1">
            <div className="h-2 bg-neutral-900 dark:bg-neutral-100 w-24 mx-auto mb-0.5"></div>
            <div className="h-1 bg-neutral-500 w-28 mx-auto"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-800 dark:bg-neutral-200 w-16 mx-auto text-center border-b border-t border-neutral-400 py-0.5"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-5/6"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-neutral-800 dark:bg-neutral-200 w-16 mx-auto text-center border-b border-t border-neutral-400 py-0.5"></div>
            <div className="h-1 bg-neutral-400 w-12"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full"></div>
          </div>
        </div>
      );
    case 'compact-impact':
      return (
        <div className="w-full h-full bg-white dark:bg-neutral-900 p-1.5 text-[5px] space-y-1 font-sans">
          <div className="flex justify-between items-center border-b border-emerald-600 pb-0.5">
            <div className="h-1.5 bg-emerald-800 dark:bg-emerald-400 w-14 rounded-xs"></div>
            <div className="h-1 bg-neutral-400 w-12 rounded-xs"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-emerald-700 dark:bg-emerald-400 w-10"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-emerald-700 dark:bg-emerald-400 w-12"></div>
            <div className="h-1 bg-neutral-400 w-14 rounded-xs"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-full rounded-xs"></div>
            <div className="h-1 bg-neutral-300 dark:bg-neutral-700 w-11/12 rounded-xs"></div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
