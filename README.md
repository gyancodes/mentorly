# 🚀 Mentorly - AI-Powered Career Mentorship Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/tRPC-10-2596BE?style=for-the-badge&logo=trpc" alt="tRPC" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [License](#license)

## 🎯 Overview

Mentorly is an AI-powered career mentorship platform that provides personalized career guidance, interview preparation, and professional development advice. Built with modern web technologies, it offers both authenticated user sessions and anonymous chat capabilities.

### Key Highlights

- 🤖 **AI-Powered Mentorship**: Advanced career counseling using Groq AI
- 💬 **Real-time Chat**: Seamless conversation experience with typing indicators
- 🔐 **Secure Authentication**: User registration and login with session management
- 📱 **Responsive Design**: Mobile-first approach with dark/light theme support
- 🚀 **High Performance**: Built with Next.js 14 and optimized for speed

## ✨ Features

### Core Features
- **Personalized Career Advice**: Context-aware AI responses based on user background
- **Chat Session Management**: Save and resume conversations
- **Anonymous Chat**: Try the platform without registration
- **Real-time Messaging**: Instant responses with typing indicators
- **Markdown Support**: Rich text formatting in AI responses
- **Code Syntax Highlighting**: Beautiful code blocks with copy functionality

### User Experience
- **Dark/Light Theme**: Automatic theme switching with user preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Polished UI with thoughtful transitions
- **Accessibility**: WCAG compliant design patterns

### Technical Features
- **Type-Safe API**: End-to-end type safety with tRPC
- **Database Integration**: PostgreSQL with Prisma ORM
- **Authentication**: Secure user management with Better Auth
- **Error Handling**: Comprehensive error boundaries and validation
- **Performance Optimization**: Code splitting and lazy loading

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: Radix UI primitives
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion

### Backend
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Authentication**: Better Auth
- **AI Integration**: Groq SDK

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Git Hooks**: Husky for pre-commit checks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm/yarn/pnpm**: Latest stable version
- **PostgreSQL**: Version 13 or higher
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mentorly.git
cd mentorly
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

## ⚙️ Environment Setup

### 1. Create Environment File

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mentorly"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# AI Integration
GROQ_API_KEY="your-groq-api-key"

# Optional: External Services
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Get Required API Keys

#### Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE mentorly;

-- Create user (optional)
CREATE USER mentorly_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mentorly TO mentorly_user;
```

### 2. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Optional: Seed the database
npx prisma db seed
```

### 3. View Database (Optional)

```bash
# Open Prisma Studio
npx prisma studio
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start the development server
npm run dev

# Or with other package managers
yarn dev
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```


## 📁 Project Structure

```
mentorly/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── api/                # API routes
│   │   │   └── trpc/           # tRPC API handlers
│   │   ├── chat/               # Chat interface
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   ├── auth/               # Authentication components
│   │   ├── chat/               # Chat-related components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts             # Authentication config
│   │   ├── db.ts               # Database connection
│   │   ├── groq.ts             # AI integration
│   │   └── utils.ts            # Helper functions
│   ├── server/                 # Server-side code
│   │   ├── routers/            # tRPC routers
│   │   │   ├── auth.ts         # Auth procedures
│   │   │   └── chat.ts         # Chat procedures
│   │   └── trpc.ts             # tRPC configuration
│   └── types/                  # TypeScript type definitions
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration files
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```typescript
// POST /api/auth/register
interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    token: string;
    expiresAt: Date;
  };
}
```

#### Login User
```typescript
// POST /api/auth/login
interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    token: string;
    expiresAt: Date;
  };
}
```

### Chat Endpoints

#### Create Chat Session
```typescript
// tRPC: chat.createSession
interface CreateSessionInput {
  title?: string;
}

interface CreateSessionResponse {
  id: string;
  title: string;
  createdAt: Date;
}
```

#### Send Message
```typescript
// tRPC: chat.sendMessage
interface SendMessageInput {
  sessionId: string;
  content: string;
  context?: {
    careerStage?: string;
    industry?: string;
    goals?: string[];
  };
}

interface SendMessageResponse {
  userMessage: {
    id: string;
    content: string;
    role: 'user';
    createdAt: Date;
  };
  aiMessage: {
    id: string;
    content: string;
    role: 'assistant';
    createdAt: Date;
  };
}
```

#### Send Anonymous Message
```typescript
// tRPC: chat.sendAnonymousMessage
interface SendAnonymousMessageInput {
  content: string;
  context?: {
    careerStage?: string;
    industry?: string;
    goals?: string[];
  };
}

interface SendAnonymousMessageResponse {
  response: string;
}
```

#### Get Chat Sessions
```typescript
// tRPC: chat.getSessions
interface GetSessionsResponse {
  sessions: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      messages: number;
    };
  }[];
}
```

#### Get Session Messages
```typescript
// tRPC: chat.getSession
interface GetSessionInput {
  sessionId: string;
}

interface GetSessionResponse {
  id: string;
  title: string;
  createdAt: Date;
  messages: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: Date;
  }[];
}
```

#### Delete Session
```typescript
// tRPC: chat.deleteSession
interface DeleteSessionInput {
  sessionId: string;
}

interface DeleteSessionResponse {
  success: boolean;
}
```

### Error Handling

All API endpoints return standardized error responses:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    data?: any;
  };
}

// Common error codes:
// - UNAUTHORIZED: User not authenticated
// - FORBIDDEN: User lacks permission
// - NOT_FOUND: Resource not found
// - BAD_REQUEST: Invalid input data
// - INTERNAL_SERVER_ERROR: Server error
// - TOO_MANY_REQUESTS: Rate limit exceeded
```

## 🎨 UI Components

### Chat Interface
- **ChatInterface**: Main chat container with message list and input
- **MessageBubble**: Individual message display with role-based styling
- **MessageContent**: Markdown rendering with syntax highlighting
- **TypingIndicator**: Animated typing indicator for AI responses
- **ChatInput**: Message input with send button and keyboard shortcuts

### Authentication
- **AuthForm**: Unified login/register form with validation
- **ProtectedRoute**: Route wrapper for authenticated pages
- **SessionProvider**: Context provider for user session

### Layout
- **Sidebar**: Navigation sidebar with session list
- **Header**: Top navigation with user menu
- **ThemeToggle**: Dark/light theme switcher









## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.





---

<div align="center">
  <p>Made with ❤️ for career development</p>
</div>
