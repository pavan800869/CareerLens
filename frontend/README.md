# Frontend (Vite/React SPA)

React SPA for candidate and admin experiences consuming the Express backend API.

## Architecture

```mermaid
flowchart TD
  subgraph SPA[React SPA]
    UI[Screens + Components]
    State[Redux Slices]
    Hooks[Data Fetching Hooks]
  end

  API[(Express API)]

  UI --> State
  UI --> Hooks
  Hooks --> API
```

## Workflows

### Job browsing and applying

```mermaid
sequenceDiagram
  actor Candidate
  participant SPA as React SPA
  participant API as Express API

  Candidate->>SPA: Browse jobs
  SPA->>API: GET /api/v1/jobs
  API-->>SPA: Jobs list
  SPA->>Candidate: Render

  Candidate->>SPA: Apply to job
  SPA->>API: GET/POST /api/v1/applications/apply/:jobId (auth)
  API-->>SPA: Success
  SPA->>Candidate: Toast + update UI
```

### AI Career Pathway view

```mermaid
sequenceDiagram
  actor User
  participant SPA as React SPA (JobPathway.jsx)
  participant API as Express API /api/v1/ai

  User->>SPA: Open pathway page
  SPA->>API: GET /api/v1/ai/jobs/:jobId/pathway
  API-->>SPA: Pathway payload (markdown/text)
  SPA->>User: Render via Markdown
```

## Key paths

- Screens/components: `src/components/*`
- Admin screens: `src/components/admin/*`
- Redux store/slices: `src/redux/*`
- Hooks: `src/hooks/*`
- API constants: `src/utils/constant.js`
