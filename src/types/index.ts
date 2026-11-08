export interface AtsKeyword {
  keyword: string;
  priority: 'critical' | 'high' | 'medium';
  category?: 'technical' | 'domain' | 'leadership' | 'methodology';
  selected?: boolean;
}

export interface JobDescriptionData {
  jobTitle: string;
  companyName: string;
  industry?: string;
  location?: string;
  employmentType?: string;
  experienceRequired?: string;
  hardSkills: string[];
  softSkills: string[];
  atsKeywords: AtsKeyword[];
  keyResponsibilities?: string[];
  qualifications?: string[];
  companyCultureClues?: string;
  rawText?: string;
  screenshotUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: string[];
  keywordsInjected?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  gradYear: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  bullets: string[];
}

export interface ResumeSkills {
  technical: string[];
  tools: string[];
  soft: string[];
}

export interface ResumeProfile {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
  skills: ResumeSkills;
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications?: string[];
}

export interface AtsRecommendation {
  type: 'critical' | 'warning' | 'tip';
  title: string;
  advice: string;
}

export interface AtsAnalysisResult {
  overallScore: number;
  breakdown: {
    skillMatchScore: number;
    experienceScore: number;
    keywordRelevanceScore: number;
    formattingAtsScore: number;
  };
  summary: string;
  matchedSkills: string[];
  missingKeywords: string[];
  recommendations: AtsRecommendation[];
}

export interface TailoredResumeResult {
  tailoredSummary: string;
  tailoredHeadline: string;
  tailoredExperiences: ExperienceItem[];
  tailoredSkills: ResumeSkills;
  tailoredProjects: ProjectItem[];
  alignmentHighlights: string[];
  projectedAtsScore: number;
}

export interface CoverLetterResult {
  subject: string;
  salutation: string;
  paragraphs: string[];
  fullText: string;
  keySellingPoints: string[];
}

export type ResumeTemplateId =
  | 'ats-classic'
  | 'executive-modern'
  | 'tech-minimal'
  | 'nordic-clean'
  | 'sidebar-split'
  | 'ivy-traditional'
  | 'compact-impact';

export interface ResumeTemplateMeta {
  id: ResumeTemplateId;
  name: string;
  subtitle: string;
  category: 'ATS Optimized' | 'Executive' | 'Tech & Engineering' | 'Design & Creative' | 'Academic & Finance';
  description: string;
  atsCompatibilityScore: number;
  badge: string;
  fontFamily: string;
  accentColor: string;
}

export interface ApplicationRecord {
  id: string;
  companyName: string;
  role: string;
  date: string;
  matchScore: number;
  jobDescription: JobDescriptionData;
  tailoredResume: TailoredResumeResult;
  coverLetter?: CoverLetterResult;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Archived';
  notes?: string;
}
