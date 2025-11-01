# Backend (Express API)

Express REST API serving job marketplace features and AI helper endpoints.

## Architecture

```mermaid
flowchart TD
  subgraph API[Express API]
    R[Routes] --> C[Controllers]
    C --> M[Mongoose Models]
    C --> U1[Cloudinary Utils]
    C --> U2[AI Helper Logic]
  end

  DB[(MongoDB)]
  Cloud[(Cloudinary)]

  C <-- CRUD --> DB
  C <-- Uploads --> Cloud
```

## Workflows

### Job browsing and applying

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

  Candidate->>SPA: Apply to job
  SPA->>API: GET/POST /api/v1/applications/apply/:jobId (auth)
  API->>BDB: Create application
  BDB-->>API: OK
  API-->>SPA: Success
```

### AI pathway endpoint

```mermaid
sequenceDiagram
  participant SPA as Vite SPA (JobPathway.jsx)
  participant API as Express API /api/v1/ai
  participant LLM as AI logic (controller/templates)

  SPA->>API: GET /api/v1/ai/jobs/:jobId/pathway
  API->>LLM: Build prompt + generate
  LLM-->>API: Pathway content
  API-->>SPA: Payload
```

## Key paths

- Routes: `routes/*.js`
- Controllers: `controllers/*.js`
- Models: `models/*.js`
- Utils: `utils/`

## Env vars

- MongoDB URI, JWT secret
- Cloudinary: cloud name, API key/secret
