# Online Examination System

A comprehensive online examination platform built with React and Vite, supporting live exams, practice tests, and detailed performance analytics.

## Features

- 🎯 Live and Practice Exams (BCS, HSC, Bank exams)
- 📊 Detailed Performance Analytics
- 🏆 Real-time Leaderboards
- 👤 User Profiles with Exam History
- 📱 Responsive Design
- 🔐 Secure Authentication

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: TailwindCSS, DaisyUI
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **UI Components**: Heroicons, Lucide React
- **PDF Generation**: jsPDF
- **Authentication**: Firebase, JWT

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Exam-system-running-client-side
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment to Vercel

### Prerequisites
- A Vercel account
- Your backend API deployed and accessible

### Steps

1. **Connect Repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Environment Variables**:
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variable:
     - **Name**: `VITE_API_URL`
     - **Value**: Your production API URL (e.g., `https://api.yourdomain.com/api`)
   - Make sure to add it for all environments (Production, Preview, Development)

3. **Deploy**:
   - Vercel will automatically detect the Vite configuration
   - Click "Deploy"
   - Your application will be live at `https://your-project.vercel.app`

### Vercel Configuration

The project includes a `vercel.json` file that:
- Configures the build command and output directory
- Sets up SPA routing (all routes redirect to index.html)

### Post-Deployment

After deployment:
1. Verify the application loads correctly
2. Test all routes and navigation
3. Ensure API connectivity is working
4. Check that authentication flows work properly

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |

## Project Structure

```
src/
├── Pages/          # Application pages/routes
├── components/     # Reusable components
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
├── Route.jsx       # Route configuration
└── index.jsx       # Application entry point
```

## Support

For issues or questions, please open an issue in the repository.
