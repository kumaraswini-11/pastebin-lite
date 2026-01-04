# Pastebin Lite

A modern, lightweight pastebin application built with Next.js 16 and Supabase. Share text snippets with optional expiration times and view limits.

## Features

- **Create Pastes**: Share text snippets with unique URLs
- **TTL Support**: Set time-to-live (expiration) for pastes
- **View Limits**: Restrict the number of times a paste can be viewed
- **Clean UI**: Modern, minimalist design focused on usability
- **Type-Safe**: Built with TypeScript for reliability
- **Real-time**: Powered by Supabase for instant data persistence

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## Architecture & Design Principles

This project follows best practices including:

- **SOLID Principles**: Clean separation of concerns with dedicated utilities
- **DRY**: Reusable components and functions
- **Scalability**: Modular architecture for easy expansion
- **Type Safety**: Comprehensive TypeScript types
- **Security**: Row Level Security (RLS) enabled on Supabase

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts          # Health check endpoint
│   │   └── pastes/
│   │       ├── route.ts           # POST /api/pastes
│   │       └── [id]/
│   │           └── route.ts       # GET /api/pastes/:id
│   ├── p/
│   │   └── [id]/
│   │       └── page.tsx           # Paste view page
│   ├── page.tsx                   # Home page (create paste)
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx              # 404 page
│   └── globals.css                # Global styles
├── components/
│   ├── create-paste-form.tsx      # Paste creation form
│   ├── paste-view.tsx             # Paste display component
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── paste.ts                   # Core paste utilities
│   └── supabase/
│       ├── server.ts              # Server-side Supabase client
│       └── client.ts              # Client-side Supabase client
└── types/
    └── paste.ts                   # TypeScript types
```

## Database Schema

```sql
CREATE TABLE pastes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content TEXT NOT NULL,
  max_views INT,
  view_count INT DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Database function for atomic view count increment
CREATE FUNCTION increment_paste_view_count(paste_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE pastes
  SET view_count = view_count + 1
  WHERE id = paste_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## API Documentation

### Health Check

**GET** `/api/healthz`

Returns the health status of the application.

**Response:**

```json
{
  "status": "ok"
}
```

---

### Create Paste

**POST** `/api/pastes`

Creates a new paste.

**Request Body:**

```json
{
  "content": "string (required)",
  "ttl": "number (optional) - seconds until expiration",
  "max_views": "number (optional) - maximum view count"
}
```

**Response (201):**

```json
{
  "id": "abc123",
  "url": "/p/abc123"
}
```

**Errors:**

- `400` - Invalid request body
- `500` - Server error

---

### Get Paste

**GET** `/api/pastes/:id`

Retrieves a paste and increments its view count.

**Response (200):**

```json
{
  "id": "abc123",
  "content": "Hello, world!",
  "created_at": "2025-01-04T10:00:00Z",
  "expires_at": "2025-01-05T10:00:00Z",
  "max_views": 10,
  "view_count": 5
}
```

**Errors:**

- `404` - Paste not found
- `410` - Paste expired or max views reached
- `500` - Server error

## Environment Variables

The following environment variables are required (automatically configured via Supabase integration):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. **Clone or download the project**

2. **Connect Supabase Integration**
   - The Supabase integration is already connected to this project
   - Environment variables are automatically configured

3. **Install dependencies** (if running locally)

   ```bash
   npm install
   ```

4. **Run database migrations**
   - The database schema has been automatically applied via Supabase integration
   - Tables and functions are ready to use

5. **Start development server** (if running locally)

   ```bash
   npm run dev
   ```

## Usage

### Creating a Paste

1. Visit the home page (`/`)
2. Enter your text content
3. Optionally set:
   - **TTL**: Time in seconds until the paste expires
   - **Max Views**: Maximum number of times the paste can be viewed
4. Click "Create Paste"
5. Share the generated URL

### Viewing a Paste

1. Navigate to `/p/:id` where `:id` is the paste ID
2. The paste content will be displayed
3. View count is automatically incremented
4. Metadata shows:
   - Creation date
   - Expiration date (if set)
   - Remaining views (if max_views set)

### Paste Expiration

Pastes become unavailable when:

- The expiration time (`expires_at`) is reached
- The maximum view count (`max_views`) is exceeded

## Key Implementation Details

### Server-Side Rendering

- Paste view pages use Next.js Server Components for optimal performance
- Initial paste data is fetched server-side
- View count increment happens client-side via API call

### Type Safety

- Comprehensive TypeScript interfaces for all data structures
- Type-safe Supabase queries using proper typing
- Runtime validation in API routes

### Security

- Row Level Security (RLS) enabled on Supabase tables
- Parameterized queries prevent SQL injection
- Input validation on all API endpoints
- Anonymous access controlled via RLS policies

### Scalability

- Modular architecture allows easy feature additions
- Reusable utility functions for paste operations
- Singleton pattern for Supabase clients prevents connection issues
- Database functions for atomic operations

## Future Enhancements

Possible features to add:

- Syntax highlighting for code snippets
- Paste editing (within time window)
- User accounts and paste management
- Paste categories/tags
- Search functionality
- Custom URLs/slugs
- Dark mode toggle
- Password-protected pastes

## License

This project was created as a take-home assignment for demonstrating Next.js and Supabase integration skills.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
