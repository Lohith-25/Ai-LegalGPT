# AI LegalGPT Frontend

React + Vite frontend for the AI Legal Assistant application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

- **Chat Interface**: Interactive chat similar to ChatGPT
- **Case Type Selection**: Select from FIR, Consumer Complaint, Rental Dispute, Cyber Crime
- **Multilingual Support**: English and regional languages
- **Responsive Design**: Works on desktop and mobile
- **Real-time Guidance**: Get step-by-step legal guidance
- **Document Checklists**: View required documents and timeline

## Component Structure

```
src/
├── components/         # Reusable UI components
├── pages/              # Page components
├── services/           # API calls
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
├── styles/             # CSS files
└── App.tsx             # Main App component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
