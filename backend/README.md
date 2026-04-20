# CareerLens Backend

This directory contains the Node.js and Express REST API backend for the CareerLens platform. It manages data for jobs, users, companies, and applications. It also handles the logic for advanced AI features like Mock Interviews and Career Pathway generation using Langchain and Google Gemini.

## Tech Stack

- **Framework**: Node.js with Express.js.
- **Database**: MongoDB with Mongoose ORM.
- **Authentication**: JWT (JSON Web Tokens) with `jsonwebtoken` and `bcryptjs` for password hashing, passed via cookies.
- **File Uploads**: `multer` for handling `multipart/form-data` and Cloudinary API for secure cloud storage of resumes and company logos.
- **AI Integrations**: 
  - `@google/generative-ai` and `@langchain/google-genai` for Mock Interview question generation and evaluation.
  - `langchain` core components for AI prompt templating and structuring output.
- **Other Utilities**:
  - `pdf2json` and `mammoth` for parsing text out of uploaded PDF and DOCX resumes.
  - `serpapi` / `google-search-results-nodejs` for potential external search integrations.

## Directory Structure

```text
/
├─ controllers/    # API endpoint logic (users, jobs, companies, ai, interviews)
├─ middlewares/    # Custom middlewares (e.g., isAuthenticated, multer config)
├─ models/         # Mongoose schema definitions
├─ routes/         # Express route declarations mapped to controllers
├─ utils/          # Helpers (DB connection, Cloudinary config, Resume Parser, Prompt Templates)
├─ index.js        # Main Express application entry point
└─ seedData.js     # Script to populate the database with mock data
```

## Core Workflows and APIs

### Authentication (`/api/v1/user`)
- **POST `/register`**: Creates a new user (Candidate or Recruiter), hashing their password. Can handle profile picture file uploads.
- **POST `/login`**: Authenticates a user and sets a secure `token` cookie.
- **GET `/logout`**: Clears the authentication cookie.
- **POST `/profile/update`**: Updates user details, skills, and parses uploaded resumes via Cloudinary.

### Jobs & Companies (`/api/v1/jobs`, `/api/v1/company`)
- **GET / POST Jobs**: Fetch all jobs, fetch by ID, or post a new job (Recruiters only).
- **GET / POST Companies**: Register a company, get a list of companies by user, or get a single company by ID. Includes uploading company logos.

### Applications (`/api/v1/application`)
- **POST `/apply/:id`**: Candidates apply for a specific job.
- **GET `/get`**: Candidates fetch jobs they've applied for.
- **GET `/:id/applicants`**: Recruiters fetch all applicants for a job they posted.
- **POST `/status/:id/update`**: Recruiters update the application status (e.g., Accepted or Rejected).

### AI Mock Interview (`/api/v1/interview`)
- **POST `/generate`**: Takes a job role and experience level, uses Gemini AI to generate customized mock interview questions (in JSON format), and saves the session.
- **POST `/answer`**: Takes a user's speech-to-text transcribed answer, evaluates it using Gemini against the expected answer, and returns feedback and a score.

### AI Pathway (`/api/v1/ai`)
- **GET `/jobs/:jobId/pathway`**: Uses AI to generate a detailed learning pathway in Markdown format tailored to a specific job description.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary Account
- Google Gemini API Key

### Environment Variables

Create a `.env` file in the `backend` directory based on the following template:

```env
PORT=8000
MONGO_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"
SECRET_KEY="your_jwt_secret"
CLOUDINARY_CLIENT_NAME="your_cloudinary_name"
CLOUDINARY_CLIENT_API="your_cloudinary_api_key"
CLOUDINARY_CLIENT_SECRET="your_cloudinary_secret"
GEMINI_API_KEY="your_google_gemini_api_key"
FRONTEND_URL="http://localhost:5173"
```

### Installation & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (uses `nodemon` for hot reloading):
   ```bash
   npm run dev
   ```

The backend API will run on `http://localhost:8000`.
