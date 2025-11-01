# ai_mock_interview (Next.js)

Next.js application for AI mock interviews using Gemini, Clerk authentication, and Neon Postgres via Drizzle.

## Architecture

```mermaid
flowchart TD
  subgraph NextApp[Next.js App]
    UI[App Router Pages + Client Components]
    Clerk[Clerk Auth]
    GenAI[Gemini Client]
    Repo[Drizzle Repository]
  end

  PG[(Neon Postgres)]

  UI --> Clerk
  UI --> GenAI
  UI --> Repo
  Repo <-- CRUD --> PG
```

## Workflows

### Create mock interview

```mermaid
sequenceDiagram
  actor User
  participant UI as AddNewInterview.jsx
  participant GEM as Gemini API
  participant PG as Neon Postgres (Drizzle)

  User->>UI: Provide role/desc/experience
  UI->>GEM: Prompt to generate N Q&A (JSON)
  GEM-->>UI: JSON-like text
  UI->>UI: Sanitize/parse to JSON
  UI->>PG: INSERT MockInterview
  PG-->>UI: mockId
  UI->>User: Navigate to /dashboard/interview/:mockId
```

### Interview session & answer capture

```mermaid
sequenceDiagram
  actor User
  participant Start as /interview/:id/start
  participant STT as Speech-to-Text (react-hook-speech-to-text)
  participant PG as Neon Postgres (Drizzle)

  User->>Start: Start session
  loop Per question
    User->>STT: Toggle mic / speak answer
    STT-->>Start: Transcript chunks
    Start->>Start: Aggregate transcript
    alt On stop and length OK
      Start->>PG: INSERT UserAnswer
      PG-->>Start: OK
    end
  end
  Start->>User: Go to feedback page (optional)
```

## Key paths

- Components: `app/dashboard/_components/*`
- Interview flow: `app/dashboard/interview/[interviewId]/*`
- Gemini client: `utils/GeminiAIModel.js`
- Drizzle DB: `utils/db.js`, schema in `utils/schema.js`

## Env vars

- `NEXT_PUBLIC_GEMINI_API_KEY` – Gemini API key
- `NEXT_PUBLIC_DRIZZLE_DB_URL` – Neon Postgres HTTP URL
- `NEXT_PUBLIC_INTERVIEW_QUESTION` – Number of questions to generate
- Clerk environment variables
