# College Assistant — RAG-Based College Chatbot

A production-quality AI-powered college information assistant built with a fully functional **Retrieval-Augmented Generation (RAG)** pipeline. Students can ask questions about admissions, fees, hostel, placements, academic calendar, and more — all answers are grounded in uploaded college documents with source citations.

## Architecture

```
College Document
      ↓
File Upload (Admin)
      ↓
Supabase Storage
      ↓
Text Extraction (PDF / DOCX / TXT / Markdown)
      ↓
Text Cleaning & Normalization
      ↓
Structure-Aware Chunking (800 tokens, 100 token overlap)
      ↓
Embedding Generation (OpenAI text-embedding-3-small)
      ↓
Vector Storage (pgvector in Supabase)
      ↓
User Question
      ↓
Query Embedding
      ↓
Semantic Similarity Search (cosine distance)
      ↓
Relevance Checking
      ↓
Context Construction (with token budget)
      ↓
LLM Generation (OpenAI GPT-4o, grounded)
      ↓
Streaming Answer + Source Citations
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Database | PostgreSQL + pgvector (Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Default LLM | OpenAI GPT-4o |
| Default Embeddings | OpenAI text-embedding-3-small (1536 dimensions) |
| Validation | Zod |
| PDF Parsing | pdf-parse |
| DOCX Parsing | mammoth |
| Markdown | react-markdown + remark-gfm |

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A [Supabase](https://supabase.com) project with pgvector enabled
- An [OpenAI](https://platform.openai.com) API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — your Supabase service role key (server-side only)
- `OPENAI_API_KEY` — your OpenAI API key

### 3. Set Up Database

Run the SQL migration files in your Supabase SQL Editor in order:

1. `supabase/migrations/001_initial_schema.sql` — tables, indexes, RLS policies
2. `supabase/migrations/002_vector_search_function.sql` — vector similarity search function
3. `supabase/migrations/003_auth_trigger.sql` — auto-create profile on signup

### 4. Create Storage Bucket

In the Supabase dashboard, create a storage bucket named `documents` (or the name specified in your `STORAGE_BUCKET` env var).

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

### For Students

1. Register / sign in at `/login`
2. Start asking questions in the chat interface
3. View source citations below each answer
4. Provide feedback with thumbs up/down

### For Administrators

1. Sign in and navigate to `/admin`
2. Upload documents via the **Upload** page (PDF, DOCX, TXT, Markdown)
3. Documents are automatically processed: extracted → cleaned → chunked → embedded
4. Use the **Documents** page to manage, publish, archive, or delete documents
5. Monitor usage on the **Dashboard** page

### Seed Data

Sample college documents are provided in the `seed/` directory:
- `Admission_Notification_2026.txt`
- `Fee_Structure_2026.txt`
- `Hostel_Information.txt`
- `Placement_Report_2025.txt`
- `Academic_Calendar_2025_26.txt`

Upload these through the admin UI to populate the knowledge base.

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── admin/                  # Admin dashboard pages
│   │   ├── documents/          # Document management & upload
│   │   ├── feedback/           # Feedback review
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   └── page.tsx            # Dashboard overview
│   ├── api/                    # API route handlers
│   │   ├── admin/              # Admin APIs (documents, stats)
│   │   ├── chat/               # Chat endpoint (streaming RAG)
│   │   ├── conversations/      # Conversation CRUD
│   │   └── messages/           # Feedback endpoint
│   ├── chat/                   # Chat interface
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   └── forgot-password/        # Password reset
├── components/
│   └── chat/                   # ChatSidebar, ChatWindow
├── lib/
│   ├── ai/                     # AI provider abstraction
│   │   ├── types.ts            # Provider interfaces
│   │   ├── factory.ts          # Provider factory
│   │   └── providers/openai.ts # OpenAI implementation
│   ├── auth/guards.ts          # Role-based access control
│   ├── db/                     # Supabase clients (browser + server)
│   ├── rag/                    # RAG pipeline
│   │   ├── extract.ts          # Text extraction (PDF, DOCX, TXT)
│   │   ├── clean.ts            # Text normalization
│   │   ├── chunk.ts            # Structure-aware chunking
│   │   ├── process.ts          # Processing orchestrator
│   │   ├── search.ts           # Semantic search + relevance
│   │   ├── prompt.ts           # System prompts & templates
│   │   └── service.ts          # RAG service (answerQuestion)
│   ├── validation/schemas.ts   # Zod validation schemas
│   ├── errors.ts               # Centralized error handling
│   └── rate-limit.ts           # Rate limiting
├── types/index.ts              # TypeScript type definitions
├── config/environment.ts       # Environment configuration
└── middleware.ts               # Route protection
```

## Key Design Decisions

1. **AI Provider Abstraction**: All AI interactions go through provider interfaces (`EmbeddingProvider`, `ChatProvider`). Swap OpenAI for Gemini or Anthropic by implementing the interfaces and updating the factory.

2. **Structure-Aware Chunking**: Documents are chunked respecting paragraph/section boundaries with configurable size (800 tokens) and overlap (100 tokens) to preserve context across chunk boundaries.

3. **Grounded Responses**: The system prompt explicitly instructs the LLM to only use information from retrieved documents. If no relevant context is found, the chatbot says so rather than hallucinating.

4. **Streaming SSE**: Chat responses use Server-Sent Events for real-time streaming, sending metadata (sources, conversation ID) first, then content chunks, then a done signal.

5. **Row Level Security**: All Supabase tables use RLS policies. Students can only access their own conversations. Admin routes are protected both at the middleware and API level.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## License

No license has been selected for this project. All rights are reserved by the author.
