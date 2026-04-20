# CareerLens Frontend

This directory contains the frontend Single Page Application (SPA) for the CareerLens platform. It is built using React, Vite, and Tailwind CSS. The frontend provides interfaces for both candidates (job seekers) and recruiters (admins), including advanced AI features like Mock Interviews.

## Tech Stack

- **Framework**: React 18 with Vite for lightning-fast HMR and building.
- **Styling**: Tailwind CSS for utility-first styling, along with Shadcn UI (Radix UI primitives) for accessible components.
- **State Management**: Redux Toolkit (with `redux-persist` for local storage persistence).
- **Routing**: React Router DOM.
- **AI Integrations**: 
  - `react-hook-speech-to-text` for microphone input transcription during AI mock interviews.
  - `react-webcam` for capturing the user's video feed during mock interviews.
  - `react-markdown` for rendering AI-generated career pathways.
- **Data Visualization**: Nivo Charts (`@nivo/bar`, `@nivo/line`, `@nivo/geo`) for the recruiter admin dashboard.
- **Icons & Animations**: Lucide React, Framer Motion.

## Directory Structure

```text
/src
├─ components/       # Reusable UI components
│  ├─ admin/         # Recruiter-facing components (dashboards, tables, forms)
│  ├─ auth/          # Login, Signup, Protected Route wrappers
│  ├─ dashboard/     # Charts and analytics components for admins
│  ├─ interview/     # AI Mock Interview specific components (Start, Record, Feedback)
│  ├─ shared/        # Navbar, Footer, Layouts
│  └─ ui/            # Shadcn UI base components (Button, Input, Dialog, etc.)
├─ redux/            # Redux store configuration and slices
├─ utils/            # Helper functions and constants (API endpoints)
├─ App.jsx           # Main Application component and Routing logic
└─ index.css         # Global Tailwind CSS and theme variables
```

## Workflows

### Candidate Workflows

1. **Authentication**: Users can sign up or log in. State is managed globally via Redux.
2. **Job Browsing**: Candidates view jobs on the Home or Jobs page. Filtering is available.
3. **Application**: Single-click apply functionality (resume is uploaded/managed in profile).
4. **AI Career Pathway**: Candidates can view personalized, AI-generated markdown pathways for specific job roles.
5. **AI Mock Interview**:
   - Candidates initiate a mock interview by providing job role details.
   - The UI guides them through a webcam and microphone setup.
   - Questions are displayed one-by-one.
   - The user records their answer using speech-to-text.
   - The app submits the transcript to the backend for AI evaluation.
   - Final feedback and ratings are displayed.

### Recruiter (Admin) Workflows

1. **Dashboard Analytics**: Admin home displays various charts (Bar, Line, Geo) showing application statistics.
2. **Company Management**: Admins can register and edit company profiles, including logos.
3. **Job Posting**: Admins can post new jobs linked to their registered companies.
4. **Applicant Tracking**: View a table of candidates who applied to a job, and update their application status (e.g., Accepted, Rejected).

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` or `.env.local` file if your setup requires overriding the default API base URLs configured in `src/utils/constant.js`.

### Running Locally

Start the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

### Building for Production

To create a production build:
```bash
npm run build
```
This generates optimized static files in the `dist` directory.
