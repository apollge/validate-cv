# CV Validation System

A web application that validates CV/resume information by comparing user-submitted form data against the content of an uploaded PDF document. Built with the [T3 Stack](https://create.t3.gg/).

## Features

- **Form-based Data Entry**: Users input their personal information including name, email, phone number, skills, and experience
- **PDF Upload**: Support for PDF CV/resume uploads with text extraction
- **Intelligent Validation**: Advanced text matching algorithms that compare form data against PDF content
- **Detailed Feedback**: Provides specific information about which fields match or don't match the uploaded document
- **Real-time Processing**: Instant validation results with loading states

## How It Works

1. **Fill the Form**: Enter your personal details in the web form
2. **Upload PDF**: Select and upload your CV/resume in PDF format
3. **Automatic Validation**: The system extracts text from your PDF and compares it with your form data
4. **Get Results**: Receive detailed feedback on matches and mismatches

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Database**: PostgreSQL with [Prisma](https://prisma.io) ORM
- **API**: [tRPC](https://trpc.io) for type-safe API layer
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **PDF Processing**: pdf-parse for text extraction
- **Validation**: Zod schemas for runtime type checking

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your database URL:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/validate-cv"
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run db:studio    # Open Prisma Studio
```

## Validation Algorithm

The system uses sophisticated text matching to validate CV content:

- **Text Normalization**: Removes special characters and normalizes whitespace
- **Flexible Phone Matching**: Compares last 7 digits of phone numbers
- **Skills Validation**: Individual validation of comma-separated skills
- **Experience Matching**: Word-based matching with configurable similarity thresholds
- **Fuzzy Matching**: Handles variations in formatting and minor discrepancies

## Learn More

To learn more about the T3 Stack and its components:

- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Deployment

This application can be deployed on platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build the application

For detailed deployment guides, see the [T3 Stack deployment documentation](https://create.t3.gg/en/deployment/vercel).
