# Guided Repair Companion

A production-grade, AI-powered event-driven platform designed to assist users in diagnosing and repairing electronic devices. This application leverages modern serverless architecture to provide real-time, visual-based repair guidance.

## 🚀 Overview

The Guided Repair Companion streamlines the DIY repair process. Users can select their device, capture or upload photos of the damage, and receive an instant, AI-generated diagnosis along with a comprehensive, step-by-step repair guide including parts and tools requirements.

### Key Features

- **Visual Diagnosis**: Uses advanced AI (via Google Gemini) to analyze photos of damaged devices.
- **Smart Repair Guides**: Dynamically generated step-by-step instructions tailored to the specific damage.
- **Parts & Tools Checklist**: Automatic identification of required components and specialized tools.
- **Interactive Progress Tracking**: Step-by-step navigation with completion status.
- **Community & Professionals**: Features for technician applications and repair history tracking.
- **PDF Export**: Generate portable repair guides for offline use.

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) based on Radix UI
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)

### Backend & Infrastructure
- **Platform**: [Supabase](https://supabase.com/) (Auth, Database, Edge Functions)
- **AI Integration**: [Google Gemini](https://deepmind.google/technologies/gemini/) via Lovable AI Gateway
- **Deployment**: Serverless Edge Functions (Deno)

## 🏗 Project Structure

```text
src/
├── components/
│   ├── community/    # Community and social features (ratings, etc.)
│   ├── repair/       # Repair-specific UI (ConfidenceMeter, StepCard, etc.)
│   ├── screens/      # Main application flow screens
│   └── ui/           # Reusable shadcn/ui components
├── contexts/         # React Contexts (Authentication)
├── data/             # Mock data and static content
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations (Supabase)
├── lib/              # Utility libraries
├── pages/            # Top-level page components
├── store/            # Zustand state stores
├── types/            # TypeScript type definitions
└── utils/            # Helper functions (PDF export, etc.)
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or pnpm
- Supabase CLI (for local backend development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd guided-repair-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm run test
   ```

## 🌐 Serverless Architecture

The project utilizes Supabase Edge Functions for compute-intensive tasks:
- `analyze-repair`: An edge function that receives device photos, communicates with the Gemini AI model, and returns a structured repair plan in JSON format.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
