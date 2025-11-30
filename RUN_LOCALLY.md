# Running Voter Search Locally

This project is a React + TypeScript application built with Vite. While it is configured for a full-stack environment (with an Express backend), the current prototype runs in "Mockup Mode" using client-side mock data, making it very easy to run locally without database setup.

## Prerequisites

*   **Node.js**: Version 20 or higher (Recommended LTS).
*   **npm**: Comes with Node.js.

## Installation

1.  Clone the repository or download the source code.
2.  Navigate to the project directory in your terminal.
3.  Install dependencies:

```bash
npm install
```

## Running the Application

Since the application currently uses mock data (`client/src/data/mockData.ts`) and doesn't require a real backend connection, use the client-only development script:

```bash
npm run dev:client
```

*   This starts the Vite development server.
*   Open your browser to the URL shown in the terminal (usually `http://localhost:5000`).

## Key Technologies

*   **Frontend**: React (v19), TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v4)
*   **UI Components**: Radix UI Primitives
*   **Routing**: wouter

## Note on Replit Plugins

The configuration files include plugins specific to the Replit environment (e.g., `@replit/vite-plugin-cartographer`). These are configured to be ignored when running outside of Replit, so you can run the project locally without issues.
