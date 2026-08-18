export const site = {
  name: 'Nikhil Gautam',
  initials: 'NG',
  role: 'Backend Engineer',
  tagline:
    'I build backend systems, APIs, and products with a focus on reliability, scalability, and clean architecture.',
  description:
    'Nikhil Gautam is a Backend Engineer who builds reliable backend systems, scalable APIs, and backend infrastructure — with a deep interest in distributed systems, authentication, and database design.',
  email: 'your-email@gmail.com',                    // ← REPLACE before going live
  github: 'https://github.com/nikhil-gautam-dev',
  linkedin: 'https://linkedin.com/in/your-profile', // ← REPLACE before going live
  url: 'https://nikhil-gautam-dev.github.io',
} as const;

export type Site = typeof site;
