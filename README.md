# CareerLens Monorepo

This repository contains three applications working together:

- `ai_mock_interview` – Next.js app for AI mock interviews using Gemini, Clerk auth, and Neon Postgres via Drizzle.
- `backend` – Node/Express REST API for jobs, companies, applications, users, and AI helpers; MongoDB + Cloudinary.
- `frontend` – Vite/React SPA for candidate/admin experiences consuming the backend APIs; Redux state management.

## Repository structure

```text
/Users/pavankumar/Documents/Programming/CareerLens
├─ ai_mock_interview/                # Next.js app for AI mock interviews
├─ backend/                          # Express API for job marketplace + AI helpers
└─ frontend/                         # Vite/React SPA consuming backend APIs
```

## System context

```mermaid
flowchart LR
  subgraph Users
    U1[Candidate User]
    U2[Admin User]
  end

  subgraph NextApp[ai_mock_interview (Next.js)]
    NUI[Pages + Client Components]
    NDB[(Neon Postgres\nDrizzle ORM)]
    NAuth[Clerk Auth]
    NGem[Google Generative AI\n(Gemini)]
  end

  subgraph Backend[backend (Express API)]
    BE[REST Controllers]
    BDB[(MongoDB)]
    BAI[AI Helper Logic]
    BCloud[Cloudinary]
  end

  subgraph SPA[frontend (Vite/React)]
    FUI[SPA Screens + Redux]
  end

  U1 --> NUI
  U2 --> FUI

  NUI <-->|CRUD interview data| NDB
  NUI -->|Prompts| NGem
  NUI -->|Auth| NAuth

  FUI -->|REST calls| BE
  BE -->|CRUD| BDB
  BE -->|Upload| BCloud
  FUI -->|AI pathway| BE
  BE -->|Prompting/LLM usage (optional)| BAI
```

## Component/Deployment view

```mermaid
graph TD
  subgraph Monorepo
    A[ai_mock_interview\nNext.js App Router] --> A1[UI Components (Shadcn/Lucide)]
    A --> A2[Feature: Mock Interview]
    A2 --> A2a[Gemini Client]
    A2 --> A2b[Drizzle Repo (MockInterview, UserAnswer)]
    A --> A3[Clerk Integration]
    A --> A4[Neon HTTP Driver]

    B[backend\nExpress] --> B1[Routes (jobs, companies, applications, users, ai)]
    B --> B2[Controllers]
    B --> B3[Mongoose Models]
    B --> B4[Cloudinary Utils]
    B --> B5[Mongo Connection]

    C[frontend\nVite/React SPA] --> C1[Screens (Home, Jobs, Admin)]
    C --> C2[Redux Slices]
    C --> C3[Hooks (fetchers)]
    C -->|REST| B
  end
```

## Workflows

### Create mock interview (Next.js)

```mermaid
sequenceDiagram
  actor User
  participant UI as Next.js UI (AddNewInterview.jsx)
  participant GEM as Gemini API
  participant PG as Neon Postgres (Drizzle)

  User->>UI: Fill role, description, experience
  UI->>GEM: Prompt "Generate N Q&As JSON"
  GEM-->>UI: JSON-like text response
  UI->>UI: Normalize/parse JSON
  UI->>PG: INSERT MockInterview (jsonMockResp,...)
  PG-->>UI: mockId
  UI->>User: Navigate to /dashboard/interview/:mockId
```

### Interview session (Next.js)

```mermaid
sequenceDiagram
  actor User
  participant Start as /start page
  participant STT as Speech-to-Text (react-hook-speech-to-text)
  participant PG as Neon Postgres (Drizzle)

  User->>Start: Start interview
  loop Each question
    User->>STT: Speak answer (toggle mic)
    STT-->>Start: Transcript chunks
    Start->>Start: Aggregate transcript
    alt Mic stopped and answer length ok
      Start->>PG: INSERT UserAnswer for question
      PG-->>Start: OK
    end
  end
  Start->>User: Navigate to feedback (optional)
```

### AI Career Pathway (SPA + backend)

```mermaid
sequenceDiagram
  actor User
  participant SPA as Vite SPA (JobPathway.jsx)
  participant API as Express API /api/v1/ai
  participant BDB as MongoDB (if persisting)
  participant LLM as AI logic (controller/templates)

  User->>SPA: Open job pathway view
  SPA->>API: GET /api/v1/ai/jobs/:jobId/pathway
  API->>LLM: Build prompt + fetch/generate content
  LLM-->>API: Pathway text/markdown/json
  API->>BDB: (Optional) Persist pathway
  API-->>SPA: pathway payload
  SPA->>User: Render (Markdown)
```

### Job browsing and applying (SPA + backend)

```mermaid
sequenceDiagram
  actor Candidate
  participant SPA as Vite SPA
  participant API as Express API
  participant BDB as MongoDB

  Candidate->>SPA: Browse jobs
  SPA->>API: GET /api/v1/jobs
  API->>BDB: Query list
  BDB-->>API: Jobs
  API-->>SPA: Jobs
  SPA->>Candidate: Render results

  Candidate->>SPA: Apply to job
  SPA->>API: GET/POST /api/v1/applications/apply/:jobId (auth)
  API->>BDB: Create application
  BDB-->>API: OK
  API-->>SPA: Success
  SPA->>Candidate: Toast + update UI
```

## Data stores

- ai_mock_interview: Neon Postgres via Drizzle HTTP driver.
- backend: MongoDB with Mongoose.

## Auth

- ai_mock_interview: Clerk.
- backend/frontend: Cookie/JWT (see `middlewares/isAuthenticated.js`).

## Environments

- ai_mock_interview: `NEXT_PUBLIC_GEMINI_API_KEY`, `NEXT_PUBLIC_DRIZZLE_DB_URL`, `NEXT_PUBLIC_INTERVIEW_QUESTION`, Clerk envs.
- backend: MongoDB URI, Cloudinary keys, JWT secret, etc.
- frontend: API base URLs in `src/utils/constant.js`.
