import {
  ResumeProfile,
  JobDescriptionData,
  ResumeTemplateMeta,
  ApplicationRecord,
} from '../types';

export const RESUME_TEMPLATES: ResumeTemplateMeta[] = [
  {
    id: 'ats-classic',
    name: 'ATS Clean Standard',
    subtitle: 'Universal 99% ATS Parseability',
    category: 'ATS Optimized',
    description: 'Ultra-clean single column layout formatted strictly to pass Taleo, Greenhouse, Workday, and Lever ATS parsers without styling glitches.',
    atsCompatibilityScore: 99,
    badge: 'Recommended for ATS',
    fontFamily: 'Inter, sans-serif',
    accentColor: '#1e293b',
  },
  {
    id: 'executive-modern',
    name: 'Executive Slate',
    subtitle: 'Authority & Polished Leadership',
    category: 'Executive',
    description: 'Crisp slate header, hairline rule dividers, and generous vertical rhythm designed for senior engineers, tech leads, and directors.',
    atsCompatibilityScore: 97,
    badge: 'Senior & Staff Level',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    accentColor: '#0f2744',
  },
  {
    id: 'tech-minimal',
    name: 'Tech & Systems Mono',
    subtitle: 'Engineered for Builders & Architects',
    category: 'Tech & Engineering',
    description: 'Tabular numerals, monospace dates and technology badges, and structured metric highlights emphasizing system impact.',
    atsCompatibilityScore: 96,
    badge: 'Developer Favorite',
    fontFamily: 'JetBrains Mono, monospace',
    accentColor: '#09090b',
  },
  {
    id: 'nordic-clean',
    name: 'Nordic Minimalist',
    subtitle: 'Refined Whitespace & Typography',
    category: 'Design & Creative',
    description: 'High-contrast editorial typography, balanced margins, and asymmetric date locks for modern tech scale-ups and design-driven companies.',
    atsCompatibilityScore: 95,
    badge: 'Modern Scale-ups',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    accentColor: '#334155',
  },
  {
    id: 'sidebar-split',
    name: 'Two-Column Metro',
    subtitle: 'Dual-Rail Scannability',
    category: 'Tech & Engineering',
    description: '30/70 split rail separating skills, credentials, and contact details from deep narrative work experience for fast recruiter scanning.',
    atsCompatibilityScore: 92,
    badge: 'High Density',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    accentColor: '#1e3a8a',
  },
  {
    id: 'ivy-traditional',
    name: 'Ivy League Traditional',
    subtitle: 'Timeless Academic & Corporate Rigor',
    category: 'Academic & Finance',
    description: 'Classic serif typography, centered contact bar, and formal horizontal dividers ideal for fintech, consulting, and traditional enterprises.',
    atsCompatibilityScore: 98,
    badge: 'Wall St & Consulting',
    fontFamily: 'Georgia, Newsreader, serif',
    accentColor: '#18181b',
  },
  {
    id: 'compact-impact',
    name: 'Compact 1-Page Fit',
    subtitle: 'Zero Wasted Space',
    category: 'ATS Optimized',
    description: 'Disciplined vertical spacing and inline skill clusters guaranteed to distill 6+ years of dense engineering achievements onto a single clean page.',
    atsCompatibilityScore: 96,
    badge: 'Guaranteed 1-Page',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    accentColor: '#047857',
  },
];

export const INITIAL_BASE_PROFILE: ResumeProfile = {
  fullName: 'Alex Vance',
  headline: 'Senior Full-Stack & Distributed Systems Engineer',
  email: 'alex.vance@devmail.io',
  phone: '+1 (415) 890-4321',
  location: 'San Francisco, CA (Open to Remote)',
  linkedin: 'linkedin.com/in/alexvance-eng',
  website: 'github.com/alexvance',
  summary:
    'Results-driven Senior Full-Stack Engineer with 6+ years building resilient web applications, high-throughput microservices, and design system infrastructures. Proven track record reducing API latency by 45% and leading cross-functional migration to TypeScript and modern cloud runtimes. Experienced mentor and advocate for clean architecture, automated testing, and developer velocity.',
  skills: {
    technical: [
      'TypeScript',
      'JavaScript (ESNext)',
      'React',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'Go (Golang)',
      'GraphQL',
      'RESTful APIs',
      'Tailwind CSS',
    ],
    tools: [
      'Docker',
      'Kubernetes',
      'AWS (S3, ECS, Lambda)',
      'Redis',
      'GitHub Actions (CI/CD)',
      'Datadog',
      'Jest',
      'Playwright',
      'Vite',
    ],
    soft: [
      'Technical Architecture Leadership',
      'Cross-functional Collaboration',
      'Mentorship & Code Reviews',
      'Agile Sprint Planning',
      'Incident Postmortems',
    ],
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Aura Cloud Technologies',
      role: 'Senior Full-Stack Engineer',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded the redesign and modularization of the core customer billing portal using React 19, TypeScript, and Vite, cutting initial bundle load time by 48% across 120,000 active monthly enterprises.',
        'Architected real-time usage metering service in Node.js and Redis, processing over 14 million daily analytics events with p99 response times sub-35ms.',
        'Engineered an automated CI/CD validation pipeline with GitHub Actions and Playwright end-to-end tests, slashing release cycle time from 5 days to under 4 hours.',
        'Mentored 4 junior and mid-level software engineers through structured pair programming and code reviews, resulting in a 30% reduction in production hotfixes.',
      ],
    },
    {
      id: 'exp-2',
      company: 'OmniFlow Solutions',
      role: 'Full-Stack Software Engineer',
      location: 'Austin, TX',
      startDate: '2020',
      endDate: '2022',
      current: false,
      bullets: [
        'Developed customer onboarding workflows and interactive dashboards using React, GraphQL, and PostgreSQL, increasing trial-to-paid conversion rate by 18.5%.',
        'Refactored legacy monolith database queries and implemented composite index strategies, cutting database server CPU load by 35% during peak hours.',
        'Collaborated with product managers and UI/UX designers to introduce an internal design token system, standardizing component usage across 5 product teams.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Catalyst Labs',
      role: 'Junior Frontend Developer',
      location: 'Seattle, WA',
      startDate: '2018',
      endDate: '2020',
      current: false,
      bullets: [
        'Built accessible, responsive web interfaces compliant with WCAG 2.1 AA standards for high-traffic financial planning applications.',
        'Migrated 40+ legacy jQuery components to modern React functional components with custom hooks and React Context.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Washington',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Computer Science & Software Systems',
      gradYear: '2018',
      gpa: '3.8 / 4.0',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'ResilientQueue: Distributed Async Task Engine',
      description: 'High-throughput fault-tolerant task queue built on Go, Redis Streams, and Docker.',
      techStack: ['Go', 'Redis', 'Docker', 'Prometheus'],
      link: 'github.com/alexvance/resilient-queue',
      bullets: [
        'Benchmarked at 25,000 operations/sec with zero message loss under artificial network partition testing.',
        'Built interactive web telemetry dashboard displaying real-time worker queue latency and backpressure.',
      ],
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate',
    'Certified Kubernetes Application Developer (CKAD)',
  ],
};

export const SAMPLE_PRESET_JDS: {
  id: string;
  label: string;
  company: string;
  role: string;
  icon: string;
  data: JobDescriptionData;
}[] = [
  {
    id: 'stripe-billing',
    label: 'Senior Frontend Engineer @ Stripe',
    company: 'Stripe',
    role: 'Senior Frontend Engineer (Billing Infrastructure)',
    icon: 'credit-card',
    data: {
      jobTitle: 'Senior Frontend Engineer - Billing Platform',
      companyName: 'Stripe',
      industry: 'Fintech / Global Payments',
      location: 'San Francisco, CA / Remote (US)',
      employmentType: 'Full-time',
      experienceRequired: '5+ years building production web applications at scale',
      hardSkills: [
        'TypeScript',
        'React',
        'State Management',
        'REST & GraphQL APIs',
        'Web Performance & Core Web Vitals',
        'Design Systems',
        'Automated Testing (Jest / Playwright)',
        'CI/CD Pipelines',
      ],
      softSkills: [
        'Cross-functional leadership with Product & Design',
        'Rigorous attention to edge cases and financial precision',
        'Mentorship and technical roadmapping',
        'Incident management and blameless postmortems',
      ],
      atsKeywords: [
        { keyword: 'TypeScript', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'React 18/19', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'Core Web Vitals', priority: 'high', category: 'technical', selected: true },
        { keyword: 'Design Systems', priority: 'high', category: 'technical', selected: true },
        { keyword: 'Billing Workflows', priority: 'critical', category: 'domain', selected: true },
        { keyword: 'GraphQL', priority: 'high', category: 'technical', selected: true },
        { keyword: 'Playwright', priority: 'medium', category: 'technical', selected: true },
        { keyword: 'Enterprise SaaS', priority: 'high', category: 'domain', selected: true },
        { keyword: 'Latency Reduction', priority: 'critical', category: 'methodology', selected: true },
      ],
      keyResponsibilities: [
        'Own the end-to-end architecture and frontend performance of Stripe Billing dashboard used by millions of global businesses.',
        'Partner with product managers, infra teams, and designers to build intuitive subscription management and invoice automation UI.',
        'Drive frontend quality, establishing high test coverage and zero-regression deployment workflows.',
      ],
      qualifications: [
        '5+ years professional experience shipping modern web apps using React and TypeScript.',
        'Demonstrated expertise in web performance optimization and client-side caching.',
        'Strong track record of collaboration in distributed engineering organizations.',
      ],
      companyCultureClues: 'Values high technical rigor, craftsmanship, intellectual honesty, and extreme user empathy.',
      rawText: `About the Role:
At Stripe, we are building the financial infrastructure of the internet. The Billing team is seeking a Senior Frontend Engineer to own our enterprise customer-facing dashboard. You will build mission-critical interfaces handling recurring subscriptions, invoice lifecycles, and international tax compliance.

Qualifications:
- 5+ years of software engineering experience focusing on frontend and full-stack web applications.
- Strong proficiency in modern TypeScript, React, and modular state architecture.
- Deep understanding of browser internals, rendering performance, and Core Web Vitals.
- Experience building scalable design systems and reusable component libraries.
- Bachelor's degree in Computer Science or equivalent practical experience.`,
    },
  },
  {
    id: 'anthropic-solutions',
    label: 'AI Solutions Engineer @ Anthropic',
    company: 'Anthropic',
    role: 'AI Solutions & Full-Stack Engineer',
    icon: 'sparkles',
    data: {
      jobTitle: 'AI Solutions Engineer',
      companyName: 'Anthropic',
      industry: 'Artificial Intelligence & Safety',
      location: 'San Francisco, CA (Hybrid / Remote)',
      employmentType: 'Full-time',
      experienceRequired: '4+ years full-stack or developer tools experience',
      hardSkills: [
        'TypeScript',
        'Python',
        'LLM Orchestration',
        'Prompt Evaluation',
        'RAG Pipelines',
        'Streaming WebSockets/SSE',
        'Next.js',
        'Vector Embeddings',
      ],
      softSkills: [
        'AI Safety advocacy',
        'Rapid prototyping',
        'Technical customer empathy',
        'Clear written and verbal synthesis',
      ],
      atsKeywords: [
        { keyword: 'LLM Orchestration', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'TypeScript', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'Streaming SSE', priority: 'high', category: 'technical', selected: true },
        { keyword: 'Vector Databases', priority: 'high', category: 'technical', selected: true },
        { keyword: 'Prompt Engineering', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'Developer Tools', priority: 'high', category: 'domain', selected: true },
        { keyword: 'API Integration', priority: 'medium', category: 'technical', selected: true },
      ],
      keyResponsibilities: [
        'Build production reference architectures and enterprise integrations powered by frontier Claude models.',
        'Design robust evaluation harnesses to benchmark reliability, safety, and latency.',
        'Collaborate with frontier research teams to translate model capabilities into scalable web interfaces.',
      ],
      qualifications: [
        '4+ years software development experience with TypeScript or Python.',
        'Demonstrated hands-on experience integrating generative AI or streaming APIs in production.',
      ],
      companyCultureClues: 'Mission-driven, cautious with safety, passionate about helpful and honest AI alignment.',
      rawText: `Role Overview:
Anthropic is an AI safety and research company dedicated to building reliable, beneficial artificial intelligence systems. We are looking for an AI Solutions Engineer to craft reference applications, enterprise tools, and developer experiences that showcase frontier model capabilities.`,
    },
  },
  {
    id: 'figma-platforms',
    label: 'Lead Product Engineer @ Figma',
    company: 'Figma',
    role: 'Lead Product Engineer (Editor Experience)',
    icon: 'layout',
    data: {
      jobTitle: 'Lead Product Engineer - Editor Experience',
      companyName: 'Figma',
      industry: 'Design Technology & Collaboration',
      location: 'San Francisco, CA / New York, NY / Remote',
      employmentType: 'Full-time',
      experienceRequired: '6+ years in frontend and systems architecture',
      hardSkills: [
        'TypeScript',
        'WebGL / Canvas Rendering',
        'Real-time Collaboration',
        'CRDTs / Operational Transformation',
        'WebAssembly',
        'Micro-frontends',
        'Memory Profiling',
      ],
      softSkills: [
        'Product intuition & design sensibility',
        'Leading large technical migrations',
        'Mentoring senior engineers',
      ],
      atsKeywords: [
        { keyword: 'TypeScript', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'Canvas / WebGL', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'Real-time State Sync', priority: 'critical', category: 'technical', selected: true },
        { keyword: 'Memory Profiling', priority: 'high', category: 'technical', selected: true },
        { keyword: 'Design Tools', priority: 'high', category: 'domain', selected: true },
        { keyword: '60fps UI Performance', priority: 'critical', category: 'methodology', selected: true },
      ],
      keyResponsibilities: [
        'Lead the core editor engine team delivering 60fps rendering across complex multi-page files.',
        'Design real-time synchronization protocols that eliminate multiplayer conflicts.',
      ],
      qualifications: [
        '6+ years developing high-performance web applications with heavy client-side computation.',
        'Obsession with smooth UX, typography, and microscopic latency.',
      ],
      companyCultureClues: 'Craft-obsessed, highly collaborative, user-centric, and values high aesthetic standards.',
      rawText: `At Figma, we make design accessible to everyone. We are looking for a Lead Product Engineer to push the boundaries of what is possible in the browser canvas.`,
    },
  },
];

export const INITIAL_SAVED_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-sample-1',
    companyName: 'Stripe',
    role: 'Senior Frontend Engineer - Billing Platform',
    date: '2026-11-04',
    matchScore: 94,
    status: 'Interviewing',
    notes: 'Recruiter phone screen passed. Technical deep-dive scheduled next Thursday.',
    jobDescription: SAMPLE_PRESET_JDS[0].data,
    tailoredResume: {
      tailoredSummary:
        'Senior Full-Stack & Distributed Systems Engineer with 6+ years architecting high-availability web platforms, enterprise billing systems, and high-performance React applications. Proven impact reducing customer billing bundle load times by 48% at Aura Cloud and scaling real-time usage event processing to 14M daily transactions with sub-35ms p99 latency. Dedicated to high technical rigor, design systems consistency, and zero-defect deployments.',
      tailoredHeadline: 'Senior Frontend & Billing Platform Architect',
      tailoredExperiences: [
        {
          id: 'exp-1',
          company: 'Aura Cloud Technologies',
          role: 'Senior Full-Stack Engineer (Billing & Core Platform)',
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bullets: [
            'Spearheaded the redesign and modularization of the core customer billing portal using React 19, TypeScript, and Vite, cutting initial bundle load time by 48% and optimizing Core Web Vitals across 120,000 active monthly enterprises.',
            'Architected real-time usage metering service in Node.js and Redis, processing over 14 million daily analytics events with p99 response times sub-35ms and zero billing discrepancy.',
            'Engineered an automated CI/CD validation pipeline with GitHub Actions and Playwright end-to-end tests, slashing release cycle time from 5 days to under 4 hours.',
            'Mentored 4 junior and mid-level software engineers through structured pair programming and code reviews, resulting in a 30% reduction in production hotfixes.',
          ],
          keywordsInjected: ['React 19', 'Core Web Vitals', 'Billing', 'Playwright'],
        },
      ],
      tailoredSkills: {
        technical: [
          'TypeScript',
          'React',
          'Design Systems',
          'GraphQL',
          'REST APIs',
          'Core Web Vitals',
          'PostgreSQL',
          'Node.js',
        ],
        tools: ['Playwright', 'Jest', 'Docker', 'Redis', 'GitHub Actions', 'AWS'],
        soft: ['Cross-functional Leadership', 'Mentorship', 'Financial Precision', 'Agile/Scrum'],
      },
      tailoredProjects: INITIAL_BASE_PROFILE.projects,
      alignmentHighlights: [
        'Emphasizes proven billing portal modernization experience mirroring Stripe Billing needs',
        'Directly quantifies bundle size, p99 latency, and release velocity gains',
      ],
      projectedAtsScore: 94,
    },
    coverLetter: {
      subject: 'Application for Senior Frontend Engineer (Billing Platform) - Alex Vance',
      salutation: 'Dear Stripe Billing Hiring Team,',
      paragraphs: [
        'I am writing to express my strong enthusiasm for the Senior Frontend Engineer position on the Stripe Billing team. Having watched Stripe continuously redefine global payment infrastructure with unmatched developer ergonomics, I have modeled much of my own engineering standard around your design precision and operational reliability.',
        'In my current role at Aura Cloud Technologies, I led the architectural overhaul of our enterprise customer billing and invoice portal using React 19, TypeScript, and Vite. By prioritizing bundle hygiene and Core Web Vitals, my team reduced cold-start latency by 48% across 120,000 monthly active enterprises. Concurrently, I architected our real-time usage metering service handling over 14 million daily billing transactions with p99 response times under 35ms—delivering the exact financial precision your customers expect.',
        'Beyond technical execution, I believe great software is built through rigorous collaboration. I have closely partnered with product managers, designers, and infrastructure teams to introduce modular design tokens and robust Playwright testing pipelines that shrank our deployment lead time from five days to under four hours.',
        'Stripe Billing solves some of the most intricate economic coordination challenges in the world. I would welcome the opportunity to discuss how my background in high-scale billing workflows and client performance can contribute to your roadmap. Thank you for your consideration.',
      ],
      fullText: '',
      keySellingPoints: [
        'Direct experience scaling an enterprise billing portal to 120k monthly accounts',
        'Proven 48% frontend latency optimization and Core Web Vitals mastery',
        'Deep alignment with Stripe craftsmanship and reliability standards',
      ],
    },
  },
];
