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
    title: "Centralized Authentication Service",
    slug: "authentication-service",
    number: "01",
    category: "Backend · Security",
    shortDescription:
      "Authentication infrastructure for multiple applications using JWT, JWKS, and RSA cryptography.",
    description:
      "A centralized authentication service designed to issue and verify tokens across multiple independent applications. Eliminates duplicated authentication logic by providing a single source of truth for identity and access control.",
    problem:
      "When multiple applications independently implement authentication, the result is duplicated code, inconsistent security behavior, and difficult key management. Each service reinventing auth introduces risk and maintenance overhead.",
    approach:
      "Centralize token issuance and expose a JWKS endpoint so dependent services can verify tokens using the auth service's public key — without needing shared secrets. Services become stateless with respect to authentication.",
    architecture: `AUTH SERVICE
    │
JWT / JWKS / RSA Keys
    │
┌───┴───────┬──────────┐
▼           ▼          ▼
OPD      PHARMACY     LAB
Service   Service    Service`,
    technicalDecisions:
      "RSA key pairs are used over HMAC secrets to allow token verification without sharing a private key. JWKS endpoint enables automatic key rotation without redeploying services.",
    challenges:
      "Designing a clean interface for dependent services to verify tokens without coupling them to the auth service's internals. Ensuring graceful key rotation handling.",
    technologies: ["Node.js", "TypeScript", "JWT", "JWKS", "RSA", "Express"],
    featured: true,
    links: {
      github: undefined, // ← Add when repo is public
    },
  },
  {
    title: "Encora",
    slug: "encora",
    number: "02",
    category: "Full Stack · Security",
    shortDescription:
      "Real-time, end-to-end encrypted chat application — messages are encrypted in the browser before leaving your device.",
    description:
      "A full-stack chat application with true end-to-end encryption using ECDH + AES-GCM. Inspired by WhatsApp, Encora supports real-time messaging, typing indicators, message delivery and read receipts, and a mobile-first UI — with Google Sign-In and no plaintext ever reaching the server.",
    problem:
      "Most chat applications rely on server-side encryption, meaning the server can read your messages. Building genuine E2E encryption requires the cryptographic operations to happen entirely in the browser, with the server acting only as a relay.",
    approach:
      "Used the Web Crypto API to generate ECDH P-256 key pairs in the browser. Private keys are encrypted with a user PIN (PBKDF2 → AES-GCM) and backed up to the server as an opaque blob. Each message is encrypted with a shared AES-GCM key derived from ECDH — only sender and recipient can decrypt.",
    architecture: `Browser (React)
    │
    ├── HTTPS REST  ──►  Express API  ──►  MongoDB
    │
    └── WebSocket   ──►  WS Gateway  ──►  RabbitMQ
                                              │
                                         Async DB writes`,
    technicalDecisions:
      "RabbitMQ decouples message delivery from database writes — the server acknowledges sends instantly and persists asynchronously. IndexedDB stores decrypted private keys in-session to avoid re-entering the PIN on every page load.",
    challenges:
      "Designing key restoration across devices without the server ever seeing the private key. Handling WebSocket reconnection gracefully while keeping delivery/read receipt state consistent.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "WebSockets",
      "RabbitMQ",
      "MongoDB",
      "Web Crypto API",
      "Google OAuth",
    ],
    featured: true,
    links: {
      github: "https://github.com/Nikhil-Gautam-dev/encora",
      live: "https://encora-ashen.vercel.app/chats",
    },
  },
  {
    title: "mirage-encryption",
    slug: "mirage-encryption",
    number: "03",
    category: "Open Source · npm Package",
    shortDescription:
      "An npm package that simplifies MongoDB Client-Side Field Level Encryption (CSFLE) for Node.js applications.",
    description:
      "A published npm utility package that abstracts the complexity of MongoDB Client-Side Field Level Encryption. Supports multiple KMS providers (Local, AWS, Azure, GCP), automated Data Encryption Key management, and schema-based field-level encryption configuration — all with a clean, intuitive API.",
    problem:
      "MongoDB CSFLE is powerful but involves significant boilerplate: managing key vaults, DEK provisioning, schema generation, and crypt_shared library configuration. Each project has to re-implement this infrastructure.",
    approach:
      "Encapsulated the entire CSFLE setup behind a `ServerEncryptionService` class. Developers provide a KMS config and a schema file; the package handles DEK management, schema generation, and returns a standard MongoDB client with encryption transparent to business logic.",
    technicalDecisions:
      "Peer dependencies (`mongodb`, `mongodb-client-encryption`) kept separate to allow consumers to control MongoDB driver versions. Comprehensive error types (ConfigurationError, ValidationError, EncryptionError, KMSError) make debugging straightforward.",
    challenges:
      "Cross-platform support for the crypt_shared library (.dll / .dylib / .so). Designing the schema DSL to be simple enough for quick setup while still supporting complex nested field encryption.",
    result:
      "Published to npm as `mirage-encryption`. Used as the encryption backbone in the TodoCrypt demo application.",
    technologies: [
      "Node.js",
      "TypeScript",
      "MongoDB",
      "CSFLE",
      "AWS KMS",
      "Azure Key Vault",
      "GCP KMS",
      "Jest",
    ],
    featured: true,
    links: {
      github: "https://github.com/Nikhil-Gautam-dev/mirage-encryption",
      live: "https://www.npmjs.com/package/mirage-encryption",
    },
  },
  {
    title: "TodoCrypt",
    slug: "todocrypt",
    number: "04",
    category: "Full Stack · Security",
    shortDescription:
      "A full-stack todo app demonstrating MongoDB Client-Side Field Level Encryption using the mirage-encryption npm package.",
    description:
      "TodoCrypt is a production-quality full-stack application built to showcase the mirage-encryption package in action. Todo data is encrypted at the field level in MongoDB using CSFLE — the server never stores plaintext. Features user auth, CRUD operations, and a glassmorphism React UI.",
    problem:
      "Encryption libraries are often demonstrated with toy examples that don't reflect real-world integration complexity. TodoCrypt provides a realistic, end-to-end working application to validate and showcase the mirage-encryption package.",
    approach:
      "Built a Node.js/Express backend that initialises the mirage-encryption service before accepting connections. All todo fields are transparently encrypted on insert and decrypted on read. The React frontend communicates over a JWT-authenticated REST API.",
    technicalDecisions:
      "mirage-encryption handles all CSFLE setup, keeping the application layer clean. JWT + bcryptjs for secure user auth. Framer Motion for UI animations.",
    challenges:
      "Integrating MongoDB CSFLE in a deployed environment (Vercel/VPS) where the crypt_shared binary path must be configured correctly at runtime.",
    result:
      "Live at todocrypt.vercel.app — a working demonstration of field-level database encryption with a complete user experience.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "mirage-encryption",
      "Vite",
      "TailwindCSS",
    ],
    featured: true,
    links: {
      github: "https://github.com/Nikhil-Gautam-dev/TodoCrypt",
      live: "https://todo-crypt-f5wgit6n6-nikhil-gautam-devs-projects.vercel.app",
    },
  },
  {
    title: "Nikki",
    slug: "nikki",
    number: "05",
    category: "CLI · Developer Tool",
    shortDescription:
      "A terminal-first notes and reminder CLI with a background daemon and Linux desktop notifications — published to npm.",
    description:
      "Nikki is a terminal-first personal notes and reminder tool. Capture notes instantly from the shell, search and edit them, attach natural-language reminders, and receive desktop notifications via a background systemd daemon. No server, no internet connection required — everything runs locally with SQLite.",
    problem:
      "Capturing a quick thought or task in the terminal shouldn't require switching to a GUI app. Existing CLI note tools lack reminder and notification support without complex configuration.",
    approach:
      'Built a Commander.js CLI with an intuitive interface where the primary action is just `nikki "your note"`. A separate daemon process polls SQLite every 30 seconds and fires `notify-send` desktop notifications for due reminders. Nikki manages its own systemd user service installation.',
    architecture: `                   SQLite
                     │
                     ▼
              Nikki Daemon
                     │
               Every 30 sec
                     │
              Due reminder?
                /       \\
              No         Yes
              │           │
              │      notify-send
              │           │
              └─── repeat ▼ Desktop popup`,
    technicalDecisions:
      'SQLite via better-sqlite3 for zero-dependency local storage. chrono-node for natural-language date parsing ("tomorrow 10am", "in 2 hours"). tsup for fast builds. Systemd user services for daemon management without root access.',
    challenges:
      'Reliable cross-session daemon management via systemd. Making note capture completely frictionless — `nikki "thought"` with no subcommand required.',
    result:
      "Published to npm as `nikki-cli`. Installable globally with `npm install -g nikki-cli`.",
    technologies: [
      "Node.js",
      "TypeScript",
      "SQLite",
      "Commander.js",
      "systemd",
      "tsup",
      "chrono-node",
    ],
    featured: true,
    links: {
      github: "https://github.com/Nikhil-Gautam-dev/nikki",
      live: "https://nikhil-gautam-dev.github.io/nikki",
    },
  },
  {
    title: "Memory Match Mania",
    slug: "memory-match-mania",
    number: "06",
    category: "Frontend · Game",
    shortDescription:
      "A fast-paced memory card matching game built with React, Redux Toolkit, and sound effects.",
    description:
      "An interactive browser-based memory matching game where players flip cards to find matching pairs. Features score tracking, sound effects, game state management via Redux Toolkit, and a clean animated UI — built to practice React state management and game loop patterns.",
    problem:
      "A focused project to practise React state management with Redux Toolkit and UI animation patterns in the context of a real interactive game loop.",
    approach:
      "Built with React and Redux Toolkit to manage game state (cards, score, flipped state). Sound effects via use-sound. Game logic isolates card-flip mechanics, match detection, and win-state into clean slice-based reducers.",
    technicalDecisions:
      "Redux Toolkit chosen for structured slice-based state management over plain useState, demonstrating scalable state architecture. Vite for fast build and HMR. Sound adds tactile feedback to improve game feel.",
    technologies: [
      "React",
      "Redux Toolkit",
      "JavaScript",
      "Vite",
      "CSS Modules",
    ],
    featured: true,
    links: {
      github: "https://github.com/Nikhil-Gautam-dev/Memory-Match-Mania",
      live: "https://memory-match-mania-lake.vercel.app/", // ← Replace with actual URL
    },
  },
];

export const experiments: {
  title: string;
  description: string;
  technologies: string[];
}[] = [
  {
    title: "CLI Tools",
    description:
      "Small developer utilities and command-line tools built to automate repetitive tasks.",
    technologies: ["Node.js", "TypeScript"],
  },
  {
    title: "AI API Experiments",
    description:
      "Exploration of LLM APIs and integration patterns for developer tooling.",
    technologies: ["Node.js", "TypeScript", "OpenAI"],
  },
  {
    title: "ESP32 Hardware Projects",
    description:
      "Embedded programming experiments with microcontrollers and IoT sensors.",
    technologies: ["C++", "ESP32"],
  },
  {
    title: "Database Experiments",
    description:
      "Performance benchmarking, query optimization, and schema design experiments.",
    technologies: ["PostgreSQL", "MongoDB", "Redis"],
  },
  {
    title: "Performance Experiments",
    description:
      "Profiling and optimization work across Node.js APIs and database queries.",
    technologies: ["Node.js", "Clinic.js"],
  },
];
