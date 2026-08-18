export interface Project {
  title: string;
  slug: string;
  number: string;
  shortDescription: string;
  description: string;
  problem: string;
  approach: string;
  architecture?: string;
  technicalDecisions?: string;
  challenges?: string;
  result?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  links?: {
    github?: string;
    live?: string;
  };
  coverImage?: string;
}

export const projects: Project[] = [
  {
    title: 'Centralized Authentication Service',
    slug: 'authentication-service',
    number: '01',
    category: 'Backend · Security',
    shortDescription:
      'Authentication infrastructure for multiple applications using JWT, JWKS, and RSA cryptography.',
    description:
      'A centralized authentication service designed to issue and verify tokens across multiple independent applications. Eliminates duplicated authentication logic by providing a single source of truth for identity and access control.',
    problem:
      'When multiple applications independently implement authentication, the result is duplicated code, inconsistent security behavior, and difficult key management. Each service reinventing auth introduces risk and maintenance overhead.',
    approach:
      'Centralize token issuance and expose a JWKS endpoint so dependent services can verify tokens using the auth service\'s public key — without needing shared secrets. Services become stateless with respect to authentication.',
    architecture:
      `AUTH SERVICE
    │
JWT / JWKS / RSA Keys
    │
┌───┴───────┬──────────┐
▼           ▼          ▼
OPD      PHARMACY     LAB
Service   Service    Service`,
    technicalDecisions:
      'RSA key pairs are used over HMAC secrets to allow token verification without sharing a private key. JWKS endpoint enables automatic key rotation without redeploying services.',
    challenges:
      'Designing a clean interface for dependent services to verify tokens without coupling them to the auth service\'s internals. Ensuring graceful key rotation handling.',
    technologies: ['Node.js', 'TypeScript', 'JWT', 'JWKS', 'RSA', 'Express'],
    featured: true,
    links: {
      github: undefined, // ← Add when repo is public
    },
  },
  {
    title: 'HealthTech Backend',
    slug: 'healthtech-backend',
    number: '02',
    category: 'Backend · Healthcare',
    shortDescription:
      'Backend systems supporting healthcare workflows — appointments, inventory, billing, and document management.',
    description:
      'Professional backend engineering work building and maintaining services for a healthcare platform. Covers APIs for core clinical and administrative workflows with a focus on reliability, transactional correctness, and performance.',
    problem:
      'Healthcare applications involve complex, interconnected workflows — appointment scheduling, inventory management, billing, and document handling — that demand reliable and consistent backend systems.',
    approach:
      'Built RESTful APIs and backend services for each domain, using asynchronous processing via message queues for workloads that benefit from decoupling and eventual consistency.',
    technicalDecisions:
      'MongoDB for flexible schema handling across clinical domains. Redis for caching and performance-sensitive reads. RabbitMQ for async processing of notifications and background jobs.',
    challenges:
      'Ensuring transactional correctness in MongoDB for operations spanning multiple collections. Designing APIs that remain backward compatible as requirements evolve.',
    technologies: [
      'TypeScript',
      'Node.js',
      'MongoDB',
      'Redis',
      'RabbitMQ',
      'Express',
      'JWT',
    ],
    featured: true,
    links: {
      // Professional work — private repository
    },
  },
  {
    title: 'PhysXplore',
    slug: 'physxplore',
    number: '03',
    category: 'Mobile · Education',
    shortDescription:
      'Interactive physics learning application with a mobile frontend and backend API.',
    description:
      'An educational application that makes physics concepts interactive and accessible on mobile. Users can explore physics topics, run simulations, and track learning progress through a clean mobile interface backed by a REST API.',
    problem:
      'Physics education can feel abstract and difficult to engage with on static materials. Interactive exploration helps make concepts tangible.',
    approach:
      'Built a React Native mobile application connected to a Node.js/Express backend, with MongoDB storing user progress and content. Focused on a smooth and responsive UI for learning interaction.',
    technologies: ['React Native', 'Node.js', 'Express', 'MongoDB'],
    featured: true,
    links: {
      github: undefined, // ← Add when repo is public
    },
  },
  {
    title: 'Connectify',
    slug: 'connectify',
    number: '04',
    category: 'Full Stack · Social',
    shortDescription:
      'A full-stack application demonstrating REST API design, Express backend, and frontend/backend integration.',
    description:
      'A full-stack web application built to consolidate learning in REST API design, Express.js backend development, and frontend/backend integration with MongoDB. Demonstrates structured routing, data modeling, and clean API design.',
    problem:
      'Building a real application with proper API design, authentication flows, and persistent storage requires integrating multiple concepts that are often learned in isolation.',
    approach:
      'Designed a RESTful API layer with Express.js, structured MongoDB data models, and connected a frontend that consumes the API — focusing on clean separation of concerns and consistent API contracts.',
    technologies: ['JavaScript', 'Express', 'MongoDB', 'REST APIs', 'Node.js'],
    featured: true,
    links: {
      github: undefined, // ← Add when repo is public
    },
  },
  {
    title: 'BookNest',
    slug: 'booknest',
    number: '05',
    category: 'Backend · API',
    shortDescription:
      'A backend API project demonstrating relational database design with Prisma and PostgreSQL.',
    description:
      'A backend API project built to explore relational database design, ORM usage, and REST API patterns with a PostgreSQL database. BookNest manages books, authors, and reading lists through a clean API layer.',
    problem:
      'Working primarily with MongoDB, there is value in also building with relational databases and understanding how ORM abstractions like Prisma change the development workflow.',
    approach:
      'Designed a normalized PostgreSQL schema, used Prisma as the ORM for type-safe database access, and exposed the data through a Node.js REST API. Explored migrations, relations, and query optimization.',
    technologies: ['Node.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'REST APIs'],
    featured: true,
    links: {
      github: undefined, // ← Add when repo is public
    },
  },
];

export const experiments: {
  title: string;
  description: string;
  technologies: string[];
}[] = [
  {
    title: 'CLI Tools',
    description: 'Small developer utilities and command-line tools built to automate repetitive tasks.',
    technologies: ['Node.js', 'TypeScript'],
  },
  {
    title: 'AI API Experiments',
    description: 'Exploration of LLM APIs and integration patterns for developer tooling.',
    technologies: ['Node.js', 'TypeScript', 'OpenAI'],
  },
  {
    title: 'ESP32 Hardware Projects',
    description: 'Embedded programming experiments with microcontrollers and IoT sensors.',
    technologies: ['C++', 'ESP32'],
  },
  {
    title: 'Database Experiments',
    description: 'Performance benchmarking, query optimization, and schema design experiments.',
    technologies: ['PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    title: 'Performance Experiments',
    description: 'Profiling and optimization work across Node.js APIs and database queries.',
    technologies: ['Node.js', 'Clinic.js'],
  },
];
