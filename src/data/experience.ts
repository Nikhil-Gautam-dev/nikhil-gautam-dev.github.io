export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  responsibilities: string[];
  stack: string[];
}

export const experiences: Experience[] = [
  {
    company: 'Medoc Health IT',
    role: 'Backend Engineering',
    period: '[2024] — Present',              // ← REPLACE with actual start date
    description:
      'Building and maintaining backend systems for a healthcare platform, covering APIs and services across clinical and administrative workflows.',
    responsibilities: [
      'Designing and maintaining RESTful APIs for appointment, inventory, billing, and document workflows',
      'Working with MongoDB transactions to ensure data consistency across collections',
      'Implementing asynchronous processing pipelines using RabbitMQ',
      'Performance optimization using Redis caching for high-frequency reads',
      'Maintaining centralized authentication across services',
    ],
    stack: ['TypeScript', 'Node.js', 'MongoDB', 'Redis', 'RabbitMQ', 'Express'],
  },
];
