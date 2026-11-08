import React from 'react';
import {
  ResumeProfile,
  TailoredResumeResult,
  ResumeTemplateId,
} from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink } from 'lucide-react';

interface ResumeRendererProps {
  profile: ResumeProfile;
  tailored?: TailoredResumeResult | null;
  templateId: ResumeTemplateId;
  highlightKeywords?: boolean;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  profile,
  tailored,
  templateId,
  highlightKeywords = false,
}) => {
  // Merge base profile with tailored fields if present
  const summary = tailored?.tailoredSummary || profile.summary;
  const headline = tailored?.tailoredHeadline || profile.headline;
  const experiences = tailored?.tailoredExperiences || profile.experiences;
  const skills = tailored?.tailoredSkills || profile.skills;
  const projects = tailored?.tailoredProjects || profile.projects;

  // Render according to the selected template ID
  switch (templateId) {
    case 'ats-classic':
      return renderAtsClassic();
    case 'executive-modern':
      return renderExecutiveModern();
    case 'tech-minimal':
      return renderTechMinimal();
    case 'nordic-clean':
      return renderNordicClean();
    case 'sidebar-split':
      return renderSidebarSplit();
    case 'ivy-traditional':
      return renderIvyTraditional();
    case 'compact-impact':
      return renderCompactImpact();
    default:
      return renderAtsClassic();
  }

  // 1. ATS CLEAN STANDARD
  function renderAtsClassic() {
    return (
      <div className="resume-sheet bg-white text-black p-8 sm:p-10 font-sans text-[13px] leading-relaxed max-w-[800px] mx-auto shadow-sm print:shadow-none print:p-0 selection:bg-neutral-200">
        {/* Header */}
        <div className="text-center border-b border-black/80 pb-3 mb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
            {profile.fullName}
          </h1>
          <p className="text-sm font-medium text-neutral-800 mt-0.5">
            {headline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-neutral-700 mt-2">
            <span>{profile.email}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.phone}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.location}</span>
            {profile.linkedin && (
              <>
                <span aria-hidden="true">·</span>
                <span>{profile.linkedin}</span>
              </>
            )}
            {profile.website && (
              <>
                <span aria-hidden="true">·</span>
                <span>{profile.website}</span>
              </>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/40 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-neutral-800 leading-normal text-justify">
              {summary}
            </p>
          </div>
        )}

        {/* Core Competencies / Skills */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/40 pb-0.5 mb-1.5">
            Technical & Professional Skills
          </h2>
          <div className="text-xs space-y-1 text-neutral-800">
            {skills.technical?.length > 0 && (
              <p>
                <span className="font-semibold text-black">Core Languages & Frameworks: </span>
                {skills.technical.join(', ')}
              </p>
            )}
            {skills.tools?.length > 0 && (
              <p>
                <span className="font-semibold text-black">Cloud, Systems & Tools: </span>
                {skills.tools.join(', ')}
              </p>
            )}
            {skills.soft?.length > 0 && (
              <p>
                <span className="font-semibold text-black">Leadership & Methodologies: </span>
                {skills.soft.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Work Experience */}
        {experiences?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/40 pb-0.5 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black text-[13.5px]">
                      {exp.role} <span className="font-normal text-neutral-700">| {exp.company}</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-700 tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-xs italic text-neutral-600 mb-1">
                      {exp.location}
                    </div>
                  )}
                  <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12.5px]">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {renderBulletContent(bullet, highlightKeywords, exp.keywordsInjected)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/40 pb-0.5 mb-2">
              Key Engineering Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black text-[13px]">
                      {proj.name}
                      {proj.techStack?.length > 0 && (
                        <span className="font-normal text-xs text-neutral-600"> ({proj.techStack.join(', ')})</span>
                      )}
                    </span>
                    {proj.link && (
                      <span className="text-xs font-mono text-neutral-600">
                        {proj.link}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-700 mb-1">{proj.description}</p>
                  {proj.bullets?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-800 text-[12px]">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.education?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/40 pb-0.5 mb-1.5">
                Education
              </h2>
              {profile.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-black">{edu.institution}</div>
                  <div className="text-neutral-800">
                    {edu.degree} {edu.gpa ? `· GPA: ${edu.gpa}` : ''}
                  </div>
                  <div className="font-mono text-neutral-600 tabular-nums">Class of {edu.gradYear}</div>
                </div>
              ))}
            </div>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/40 pb-0.5 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc list-outside ml-4 text-xs text-neutral-800 space-y-0.5">
                {profile.certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. EXECUTIVE MODERN
  function renderExecutiveModern() {
    return (
      <div className="resume-sheet bg-white text-slate-900 font-sans text-[13px] leading-relaxed max-w-[800px] mx-auto shadow-sm print:shadow-none print:p-0">
        {/* Navy Top Banner Lockup */}
        <div className="bg-[#0f2744] text-white p-8 print:p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {profile.fullName}
          </h1>
          <p className="text-sm font-medium text-blue-200 mt-1 tracking-wide uppercase text-xs">
            {headline}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100/90 mt-3 pt-3 border-t border-blue-900/60 font-mono">
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {profile.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {profile.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {profile.location}</span>
            {profile.linkedin && <span>{profile.linkedin}</span>}
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-5 print:p-6">
          {/* Executive Summary */}
          {summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f2744] flex items-center gap-2 mb-2">
                <span className="w-2.5 h-0.5 bg-[#0f2744]"></span> Executive Profile
              </h2>
              <p className="text-slate-700 leading-normal pl-4 border-l-2 border-slate-200">
                {summary}
              </p>
            </div>
          )}

          {/* Core Leadership & Technical Competencies */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f2744] flex items-center gap-2 mb-2">
              <span className="w-2.5 h-0.5 bg-[#0f2744]"></span> Areas of Expertise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Architecture & Code</span>
                <span className="text-slate-600">{skills.technical.slice(0, 6).join(' · ')}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Infrastructure & Cloud</span>
                <span className="text-slate-600">{skills.tools.slice(0, 6).join(' · ')}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Executive Practices</span>
                <span className="text-slate-600">{skills.soft.slice(0, 5).join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f2744] flex items-center gap-2 mb-3">
              <span className="w-2.5 h-0.5 bg-[#0f2744]"></span> Career History & Achievements
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l border-slate-200">
                  <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-[#0f2744]"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 mb-1.5">
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-xs list-disc list-outside ml-3.5">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {renderBulletContent(bullet, highlightKeywords, exp.keywordsInjected)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {profile.education?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f2744] mb-1.5">
                  Education
                </h3>
                {profile.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-semibold text-slate-900">{edu.institution}</p>
                    <p className="text-slate-600">{edu.degree} ({edu.gradYear})</p>
                  </div>
                ))}
              </div>
            )}
            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f2744] mb-1.5">
                  Accreditations
                </h3>
                <ul className="text-xs text-slate-600 space-y-0.5">
                  {profile.certifications.map((c, i) => (
                    <li key={i}>✓ {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. TECH & SYSTEMS MONO
  function renderTechMinimal() {
    return (
      <div className="resume-sheet bg-[#0f1117] text-neutral-200 p-8 sm:p-10 font-mono text-[12px] leading-relaxed max-w-[800px] mx-auto border border-neutral-800 shadow-xl print:bg-white print:text-black print:border-none print:p-0">
        {/* Terminal / Code header */}
        <div className="border-b border-neutral-800 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-emerald-400 font-bold text-lg sm:text-xl block">
                {profile.fullName}
              </span>
              <span className="text-neutral-400 text-xs block mt-0.5">
                // {headline}
              </span>
            </div>
            <div className="text-right text-[11px] text-neutral-400 space-y-0.5">
              <div>{profile.email}</div>
              <div>{profile.phone}</div>
              <div>{profile.location}</div>
            </div>
          </div>
          <div className="flex gap-4 text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-800/60">
            {profile.website && <span>src: {profile.website}</span>}
            {profile.linkedin && <span>profile: {profile.linkedin}</span>}
          </div>
        </div>

        {/* Stack Overview */}
        <div className="mb-4 bg-neutral-900/80 p-3 rounded border border-neutral-800">
          <span className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">
            /* PRIMARY_STACK */
          </span>
          <div className="flex flex-wrap gap-1.5">
            {skills.technical.map((tech, idx) => (
              <span key={idx} className="bg-neutral-800 text-neutral-200 text-[11px] px-2 py-0.5 rounded border border-neutral-700">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-4">
            <span className="text-emerald-400 font-bold text-xs block mb-1">
              # 01. OBJECTIVE & ARCHITECTURAL SUMMARY
            </span>
            <p className="text-neutral-300 text-justify text-[12px] leading-normal">
              {summary}
            </p>
          </div>
        )}

        {/* Engineering Experience */}
        <div className="mb-4">
          <span className="text-emerald-400 font-bold text-xs block mb-2">
            # 02. PRODUCTION HISTORY
          </span>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l border-neutral-800 pl-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">
                    {exp.company} &gt; {exp.role}
                  </span>
                  <span className="text-neutral-400 tabular-nums">
                    [{exp.startDate} - {exp.current ? 'NOW' : exp.endDate}]
                  </span>
                </div>
                <ul className="mt-1.5 space-y-1 text-neutral-300 text-[11.5px]">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-normal">
                      <span className="text-emerald-500 mr-1.5">-&gt;</span>
                      {renderBulletContent(bullet, highlightKeywords, exp.keywordsInjected)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Projects */}
        {projects?.length > 0 && (
          <div className="mb-4">
            <span className="text-emerald-400 font-bold text-xs block mb-2">
              # 03. OPEN SOURCE & SYSTEMS BENCHMARKS
            </span>
            <div className="space-y-2">
              {projects.map((p) => (
                <div key={p.id} className="bg-neutral-900/40 p-2.5 rounded border border-neutral-800/80">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-white text-xs">{p.name}</span>
                    <span className="text-[10px] text-neutral-400">{p.techStack.join(', ')}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-3 text-[11px]">
          <div>
            <span className="text-neutral-400 uppercase text-[10px] block mb-1">Education</span>
            {profile.education.map((e) => (
              <div key={e.id}>
                <span className="text-white font-medium">{e.degree}</span> · {e.institution} ({e.gradYear})
              </div>
            ))}
          </div>
          <div>
            <span className="text-neutral-400 uppercase text-[10px] block mb-1">Certifications</span>
            <div className="text-neutral-300">{profile.certifications?.join(' · ')}</div>
          </div>
        </div>
      </div>
    );
  }

  // 4. NORDIC MINIMALIST
  function renderNordicClean() {
    return (
      <div className="resume-sheet bg-[#faf9f6] text-neutral-800 p-8 sm:p-12 font-sans text-[13px] leading-relaxed max-w-[800px] mx-auto print:bg-white print:p-0">
        {/* Generous Asymmetric Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            {profile.fullName}
          </h1>
          <p className="text-sm text-neutral-500 font-normal mt-1">
            {headline}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 mt-4 border-t border-neutral-200 pt-3">
            <span>{profile.email}</span>
            <span>·</span>
            <span>{profile.phone}</span>
            <span>·</span>
            <span>{profile.location}</span>
            {profile.linkedin && (
              <>
                <span>·</span>
                <span>{profile.linkedin}</span>
              </>
            )}
          </div>
        </div>

        {/* Narrative Summary */}
        {summary && (
          <div className="mb-8">
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
              Background
            </h2>
            <p className="text-neutral-700 leading-relaxed font-light text-[13.5px]">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-medium text-neutral-900 text-sm">{exp.role}</span>
                    <span className="text-neutral-500 text-xs ml-2">— {exp.company}</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono tabular-nums">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="space-y-1.5 text-neutral-600 text-xs mt-2 pl-4 border-l border-neutral-200">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="leading-relaxed">
                      {renderBulletContent(b, highlightKeywords, exp.keywordsInjected)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Competencies */}
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-3">
            Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-medium text-neutral-900 block mb-1">Engineering</span>
              <p className="text-neutral-600 leading-normal">{skills.technical.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium text-neutral-900 block mb-1">Cloud & Infrastructure</span>
              <p className="text-neutral-600 leading-normal">{skills.tools.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="border-t border-neutral-200 pt-4 flex justify-between text-xs text-neutral-600">
          {profile.education.map((edu) => (
            <div key={edu.id}>
              <span className="font-medium text-neutral-900">{edu.institution}</span> — {edu.degree} ({edu.gradYear})
            </div>
          ))}
          <div>{profile.certifications?.join(' · ')}</div>
        </div>
      </div>
    );
  }

  // 5. TWO-COLUMN METRO (SIDEBAR SPLIT)
  function renderSidebarSplit() {
    return (
      <div className="resume-sheet bg-white text-neutral-900 font-sans text-[12.5px] max-w-[800px] mx-auto shadow-sm flex flex-col sm:flex-row print:shadow-none print:p-0">
        {/* Left Column Rail (32%) */}
        <div className="w-full sm:w-[32%] bg-slate-900 text-slate-100 p-6 sm:p-7 shrink-0 space-y-5 print:bg-slate-900 print:text-white">
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
              {profile.fullName}
            </h1>
            <p className="text-xs text-blue-300 font-medium mt-1">
              {headline}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{profile.location}</span>
            </div>
            {profile.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{profile.linkedin}</span>
              </div>
            )}
          </div>

          {/* Skills Categorized */}
          <div className="border-t border-slate-800 pt-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-2">
              Core Skills
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              {skills.technical.map((s, idx) => (
                <div key={idx} className="bg-slate-800/80 px-2 py-1 rounded text-slate-200">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="border-t border-slate-800 pt-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-2">
              Cloud & Tools
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {skills.tools.join(', ')}
            </p>
          </div>

          {/* Education */}
          <div className="border-t border-slate-800 pt-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-2">
              Education
            </h3>
            {profile.education.map((edu) => (
              <div key={edu.id} className="text-[11px] text-slate-300">
                <div className="font-semibold text-white">{edu.institution}</div>
                <div>{edu.degree}</div>
                <div className="font-mono text-slate-400">{edu.gradYear}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Pane (68%) */}
        <div className="w-full sm:w-[68%] p-6 sm:p-8 space-y-5">
          {/* Executive Summary */}
          {summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Professional Profile
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[13px]">{exp.role}</span>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-blue-800 font-medium mb-1">
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {renderBulletContent(bullet, highlightKeywords, exp.keywordsInjected)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          {projects?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Selected Engineering Projects
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="font-bold text-slate-900">{proj.name}</div>
                    <div className="text-slate-600">{proj.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 6. IVY LEAGUE TRADITIONAL
  function renderIvyTraditional() {
    return (
      <div className="resume-sheet bg-[#fdfdfc] text-neutral-900 p-8 sm:p-10 font-serif text-[13px] leading-relaxed max-w-[800px] mx-auto print:p-0">
        {/* Centered Traditional Header */}
        <div className="text-center pb-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-serif">
            {profile.fullName}
          </h1>
          <div className="text-xs text-neutral-700 mt-1 italic">
            {headline}
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-neutral-700 mt-2 font-sans">
            <span>{profile.email}</span>
            <span>|</span>
            <span>{profile.phone}</span>
            <span>|</span>
            <span>{profile.location}</span>
            {profile.linkedin && (
              <>
                <span>|</span>
                <span>{profile.linkedin}</span>
              </>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-4">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-neutral-900 border-t border-b border-neutral-400 py-0.5 mb-2 font-sans">
              Summary of Qualifications
            </h2>
            <p className="text-neutral-800 leading-normal text-justify">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-4">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-neutral-900 border-t border-b border-neutral-400 py-0.5 mb-2.5 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-neutral-950 text-[13.5px]">
                  <span>{exp.company}</span>
                  <span className="font-normal text-xs font-sans tabular-nums text-neutral-700">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="italic text-xs text-neutral-800 mb-1">
                  {exp.role} {exp.location && `— ${exp.location}`}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12.5px]">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="leading-snug">
                      {renderBulletContent(b, highlightKeywords, exp.keywordsInjected)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Honors */}
        <div className="mb-4">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-neutral-900 border-t border-b border-neutral-400 py-0.5 mb-2 font-sans">
            Education
          </h2>
          {profile.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-bold text-neutral-900">{edu.institution}</span>, {edu.degree}
              </div>
              <span className="font-sans text-neutral-700">{edu.gradYear}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-neutral-900 border-t border-b border-neutral-400 py-0.5 mb-2 font-sans">
            Additional Information
          </h2>
          <p className="text-xs text-neutral-800 leading-normal">
            <span className="font-bold">Technical Proficiencies: </span>
            {skills.technical.concat(skills.tools).join(', ')}
          </p>
        </div>
      </div>
    );
  }

  // 7. COMPACT HIGH-IMPACT (1-PAGE FIT)
  function renderCompactImpact() {
    return (
      <div className="resume-sheet bg-white text-neutral-900 p-6 sm:p-7 font-sans text-[12px] leading-snug max-w-[800px] mx-auto border-t-4 border-emerald-700 shadow-sm print:p-0 print:border-t-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-emerald-800/30 pb-2 mb-3">
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              {profile.fullName}
            </h1>
            <p className="text-xs font-semibold text-emerald-800">
              {headline}
            </p>
          </div>
          <div className="text-right text-[11px] text-neutral-600 space-y-0.5">
            <div>{profile.email} · {profile.phone}</div>
            <div>{profile.location} · {profile.linkedin}</div>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-3">
            <p className="text-neutral-700 leading-snug text-justify text-[11.5px]">
              {summary}
            </p>
          </div>
        )}

        {/* Skills Inline */}
        <div className="mb-3 bg-emerald-50/70 p-2 rounded border border-emerald-200/60 text-[11px]">
          <span className="font-bold text-emerald-950 mr-1">Core Tech:</span>
          <span className="text-emerald-900">{skills.technical.join(' · ')}</span>
          <span className="font-bold text-emerald-950 ml-3 mr-1">Tools:</span>
          <span className="text-emerald-900">{skills.tools.slice(0, 6).join(' · ')}</span>
        </div>

        {/* Experience Compact */}
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-600/40 pb-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-2.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[12px]">
                  <span>{exp.role} <span className="font-normal text-neutral-600">| {exp.company}</span></span>
                  <span className="font-mono text-[10.5px] text-neutral-500 tabular-nums">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-neutral-700 text-[11.5px] mt-0.5">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="leading-tight">
                      {renderBulletContent(b, highlightKeywords, exp.keywordsInjected)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects & Education 2-column strip */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-200 text-[11px]">
          <div>
            <h3 className="font-bold text-emerald-900 uppercase text-[10px] mb-1">Key Projects</h3>
            {projects.map((p) => (
              <div key={p.id} className="text-neutral-700">
                <span className="font-semibold text-neutral-900">{p.name}</span>: {p.description}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 uppercase text-[10px] mb-1">Education & Certs</h3>
            {profile.education.map((e) => (
              <div key={e.id} className="text-neutral-700">
                {e.degree}, {e.institution} ({e.gradYear})
              </div>
            ))}
            <div className="text-neutral-600 mt-0.5">
              {profile.certifications?.join(' · ')}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// Helper to highlight tailored keywords or render cleanly
function renderBulletContent(
  text: string,
  highlight: boolean,
  injected?: string[]
): React.ReactNode {
  if (!highlight || !injected || injected.length === 0) {
    return text;
  }

  // Create regex pattern to highlight injected keywords
  const escaped = injected
    .filter(Boolean)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  if (!escaped) return text;

  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isKeyword = injected.some(
      (k) => k.toLowerCase() === part.toLowerCase()
    );
    if (isKeyword) {
      return (
        <span
          key={index}
          className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold px-1 rounded-xs"
          title="ATS Keyword Injected from Job Description"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}
