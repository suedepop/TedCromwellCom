# tedcromwell.com — Full Technical Spec

## Project Identity

| | |
|---|---|
| **Site** | https://www.tedcromwell.com |
| **GitHub Repo** | https://github.com/suedepop/TedCromwellCom |
| **Azure Static Web App** | Link repo on creation; custom domain `www.tedcromwell.com` via SWA → Custom Domains |

## Overview

A complete personal website for Ted Cromwell with four content sections — Blog, Concerts, Travel, and Resume — all managed through a single `/admin` area. Public-facing site uses a dark editorial aesthetic. Built on Next.js 14 with Azure backend services.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Azure Static Web Apps · Azure Functions (via SWA) · Azure Cosmos DB Serverless · Azure Blob Storage · Leaflet · Fuse.js · TipTap (blog editor)

---

## Design System

### Aesthetic
Dark editorial. Consistent across all sections.

- **Background:** `#0a0a0a`
- **Surface / Card:** `#1a1a1a`
- **Border:** `#2a2a2a`
- **Primary text:** `#f0f0f0`
- **Secondary text:** `#888888`
- **Accent:** warm amber `#e8a030` — used for links, active states, highlights
- **Fonts:** `Inter` (body) + `DM Serif Display` (display headings) via `next/font/google`
- **Images:** slight dark overlay; consistent aspect ratios per content type

### Mobile-First Breakpoints
```
sm: 640px   single column → two column grids
md: 768px   nav style changes, sidebars appear
lg: 1024px  full desktop layout
```

---

## Site Sections

| Route | Section | Description |
|-------|---------|-------------|
| `/` | Home | Personal landing — intro, recent activity across all sections |
| `/blog` | Blog | Written posts with admin markdown editor |
| `/blog/[slug]` | Blog post | Single post |
| `/concerts` | Concerts | Full concert collection imported from Setlist.fm |
| `/concerts/[id]` | Concert detail | Setlists, photos, ticket stubs, notes |
| `/venues` | Venues | All venues + full Leaflet map |
| `/venues/[id]` | Venue detail | Concerts at venue + venue map pin |
| `/travel` | Travel | Interactive world map + trips list |
| `/travel/trips/[id]` | Trip detail | Places, dates, notes for one trip |
| `/resume` | Resume | Styled web resume + PDF download link |
| `/search` | Search | Full-text search across blog, concerts, travel |
| `/admin/*` | Admin | Single shared admin area for all content |

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx                   # Root layout (nav, footer, fonts, dark theme)
│   ├── page.tsx                     # Home
│   ├── blog/
│   │   ├── page.tsx                 # Post list
│   │   └── [slug]/page.tsx          # Post detail
│   ├── concerts/
│   │   ├── page.tsx                 # Concert list
│   │   └── [id]/page.tsx            # Concert detail
│   ├── venues/
│   │   ├── page.tsx                 # All venues + map
│   │   └── [id]/page.tsx            # Venue detail
│   ├── travel/
│   │   ├── page.tsx                 # World map + trips list
│   │   └── trips/[id]/page.tsx      # Trip detail
│   ├── resume/
│   │   └── page.tsx                 # Resume web page
│   ├── search/
│   │   └── page.tsx                 # Search results
│   └── admin/
│       ├── layout.tsx               # Admin shell (auth guard, admin nav)
│       ├── page.tsx                 # Dashboard — recent activity all sections
│       ├── blog/
│       │   ├── page.tsx             # Post list
│       │   ├── new/page.tsx         # New post editor
│       │   └── [id]/page.tsx        # Edit post
│       ├── concerts/
│       │   ├── page.tsx             # Concert list
│       │   ├── import/page.tsx      # Setlist.fm import UI
│       │   └── [id]/page.tsx        # Concert editor
│       ├── venues/
│       │   ├── page.tsx             # Venue manager
│       │   └── [id]/page.tsx        # Venue editor / alias merge
│       ├── travel/
│       │   ├── page.tsx             # Trips + places manager
│       │   └── trips/
│       │       ├── new/page.tsx     # New trip
│       │       └── [id]/page.tsx    # Edit trip + places
│       └── resume/
│           └── page.tsx             # Resume editor + PDF upload
│
├── api/
│   ├── auth/
│   │   ├── login/index.ts
│   │   └── logout/index.ts
│   ├── blog/
│   │   ├── index.ts                 # GET (list) · POST (create)
│   │   └── [id]/index.ts            # GET · PUT · DELETE
│   ├── concerts/
│   │   ├── index.ts                 # GET (list)
│   │   └── [id]/index.ts            # GET · PUT · DELETE
│   ├── venues/
│   │   ├── index.ts                 # GET (list)
│   │   ├── [id]/index.ts            # GET · PUT
│   │   └── merge/index.ts           # POST
│   ├── travel/
│   │   ├── trips/
│   │   │   ├── index.ts             # GET (list) · POST (create)
│   │   │   └── [id]/index.ts        # GET · PUT · DELETE
│   │   └── places/index.ts          # GET all places (for map)
│   ├── resume/index.ts              # GET · PUT
│   ├── import/index.ts              # POST — Setlist.fm import
│   ├── upload/
│   │   ├── photo/index.ts
│   │   ├── stub/index.ts
│   │   └── resume-pdf/index.ts
│   └── search-index/index.ts        # GET — full index for Fuse.js
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                  # Public nav (links to all sections)
│   │   ├── Footer.tsx
│   │   └── AdminNav.tsx             # Sidebar nav for admin
│   ├── home/
│   │   └── ActivityFeed.tsx         # Recent items across all sections
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   └── PostBody.tsx             # Renders markdown
│   ├── concerts/
│   │   ├── ConcertCard.tsx
│   │   ├── ConcertGrid.tsx
│   │   ├── SetlistBlock.tsx
│   │   └── SetlistSortable.tsx      # Admin drag-to-reorder
│   ├── venues/
│   │   ├── VenueCard.tsx
│   │   └── VenueMap.tsx             # Leaflet — dynamically imported
│   ├── travel/
│   │   ├── TripCard.tsx
│   │   ├── WorldMap.tsx             # Leaflet — full world map, all places
│   │   └── PlaceMarker.tsx          # Custom marker by place type
│   ├── resume/
│   │   └── ResumeView.tsx           # Styled resume renderer
│   ├── media/
│   │   ├── PhotoGallery.tsx
│   │   ├── TicketStub.tsx
│   │   └── UploadDropzone.tsx
│   ├── search/
│   │   └── SearchBar.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── MarkdownEditor.tsx       # TipTap wrapper
│       └── Spinner.tsx
│
├── lib/
│   ├── cosmos.ts
│   ├── blob.ts
│   ├── auth.ts
│   ├── setlistfm.ts
│   ├── searchIndex.ts
│   └── types.ts
│
├── staticwebapp.config.json
└── .env.local
```

---

## Data Models (`lib/types.ts`)

### Blog

```typescript
export interface BlogPost {
  id: string;
  slug: string;                  // URL-safe, unique: "my-post-title"
  title: string;
  excerpt: string;               // Plain text, ~160 chars
  content: string;               // Markdown string (from TipTap)
  coverImageUrl?: string;        // Blob Storage URL
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;          // ISO datetime — set on first publish
  updatedAt: string;
}
// Cosmos container: posts | partition key: /status
```

### Concerts

```typescript
export interface Concert {
  id: string;
  pk: string;                    // Same as venueId (partition key)
  venueId: string;
  venueNameRaw: string;
  date: string;                  // "YYYY-MM-DD"
  city: string;
  country: string;
  setlists: Setlist[];           // Ordered by sortOrder
  photos: Photo[];
  ticketStubs: TicketStub[];     // Separate from photos
  links: Link[];
  notes: string;
  setlistFmIds: string[];
  importedAt: string;
  updatedAt: string;
}

export interface Setlist {
  sortOrder: number;             // 0-based performance order
  artist: string;
  setlistFmId: string;
  songs: Song[];
}

export interface Song {
  sortOrder: number;
  name: string;
  info?: string;
  cover?: string;
  tape?: boolean;
}

export interface Photo {
  id: string;
  blobUrl: string;
  thumbnailUrl: string;
  caption?: string;
  uploadedAt: string;
}

export interface TicketStub {
  id: string;
  blobUrl: string;
  thumbnailUrl: string;
  label?: string;                // e.g. "Floor GA", "Section 104 Row C"
  uploadedAt: string;
}

export interface Link {
  label: string;
  url: string;
}
// Cosmos container: concerts | partition key: /venueId

export interface Venue {
  id: string;                    // partition key
  canonicalName: string;
  city: string;
  state?: string;
  country: string;
  aliases: string[];
  lat?: number;
  lng?: number;
  url?: string;
  notes?: string;
}
// Cosmos container: venues | partition key: /id
```

### Travel

```typescript
export interface Trip {
  id: string;
  title: string;                 // e.g. "Japan 2023", "Road Trip — Southwest"
  startDate: string;             // "YYYY-MM-DD"
  endDate: string;
  notes: string;                 // Markdown
  placeIds: string[];            // References to Place documents
  coverImageUrl?: string;
  updatedAt: string;
}
// Cosmos container: trips | partition key: /id

export interface Place {
  id: string;
  name: string;                  // e.g. "Eiffel Tower", "Paris", "France"
  type: 'country' | 'city' | 'landmark';
  city?: string;
  country: string;
  countryCode: string;           // ISO 3166-1 alpha-2, e.g. "FR"
  lat: number;
  lng: number;
  visitedAt?: string;            // "YYYY-MM-DD" — most specific date known
  tripIds: string[];             // Which trips include this place
  notes?: string;
}
// Cosmos container: places | partition key: /countryCode
// Grouping by countryCode makes "all places in France" a cheap single-partition query
```

### Resume

```typescript
export interface Resume {
  id: 'resume';                  // Single document, fixed ID
  pk: 'resume';
  name: string;
  tagline: string;
  email: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  summary: string;               // Markdown
  experience: ResumeEntry[];
  education: ResumeEntry[];
  skills: SkillGroup[];
  pdfBlobUrl?: string;           // Uploaded PDF in Blob Storage
  updatedAt: string;
}

export interface ResumeEntry {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate: string;             // "YYYY-MM" or "YYYY"
  endDate?: string;              // omit for current
  bullets: string[];             // Markdown strings
  sortOrder: number;
}

export interface SkillGroup {
  category: string;              // e.g. "Languages", "Frameworks", "Tools"
  skills: string[];
  sortOrder: number;
}
// Cosmos container: resume | partition key: /pk
```

### Search Index

```typescript
export interface SearchIndexEntry {
  id: string;
  type: 'post' | 'concert' | 'trip';
  title: string;
  date?: string;
  body: string;                  // Flattened searchable text
  url: string;                   // Route to link to on match
}
```

---

## Cosmos DB Containers Summary

| Container | Partition Key | Documents |
|-----------|--------------|-----------|
| `posts` | `/status` | Blog posts |
| `concerts` | `/venueId` | Concerts |
| `venues` | `/id` | Venues |
| `trips` | `/id` | Travel trips |
| `places` | `/countryCode` | Travel places |
| `resume` | `/pk` | Single resume document |

All in one Cosmos DB account: `tedcromwell-cosmos` · Mode: Serverless

---

## API Routes

All `GET` routes are public. All `POST`, `PUT`, `DELETE` routes require admin JWT.

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | `{ username, password }` → sets httpOnly JWT cookie |
| POST | `/api/auth/logout` | Clears cookie |

### Blog
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/blog` | List posts. `?status=published` for public, `?status=draft` for admin |
| POST | `/api/blog` | Create post |
| GET | `/api/blog/:id` | Single post |
| PUT | `/api/blog/:id` | Update post (including publish action) |
| DELETE | `/api/blog/:id` | Delete post |

### Concerts
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/concerts` | List. Params: `?venueId=` `?year=` `?artist=` |
| GET | `/api/concerts/:id` | Single concert |
| PUT | `/api/concerts/:id` | Update |
| DELETE | `/api/concerts/:id` | Delete |
| POST | `/api/import` | Setlist.fm import. `{ commit: boolean }` |

### Venues
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/venues` | All venues (includes lat/lng) |
| GET | `/api/venues/:id` | Single venue |
| PUT | `/api/venues/:id` | Update |
| POST | `/api/venues/merge` | `{ keepId, mergeId }` — merge two venues |

### Travel
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/travel/trips` | All trips |
| POST | `/api/travel/trips` | Create trip |
| GET | `/api/travel/trips/:id` | Single trip |
| PUT | `/api/travel/trips/:id` | Update trip |
| DELETE | `/api/travel/trips/:id` | Delete trip |
| GET | `/api/travel/places` | All places (for world map) |

### Resume
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/resume` | Get resume document |
| PUT | `/api/resume` | Update resume content |

### Upload
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/upload/photo` | Concert photo → `/photos/` |
| POST | `/api/upload/stub` | Ticket stub → `/stubs/` |
| POST | `/api/upload/resume-pdf` | Resume PDF → `/resume/` |
| POST | `/api/upload/blog-cover` | Blog cover image → `/blog/` |
| POST | `/api/upload/trip-cover` | Trip cover image → `/travel/` |

### Search
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/search-index` | Full index: blog posts + concerts + trips for Fuse.js |

---

## Auth (`lib/auth.ts`)

```typescript
// Environment variables:
// ADMIN_USERNAME=ted
// ADMIN_PASSWORD_HASH=bcrypt_hash
// JWT_SECRET=32+_char_random_string

// Cookie: name='admin_token', httpOnly, Secure, SameSite=Strict, maxAge=7days
// All /admin/* page routes check cookie client-side on mount via /api/auth/me
// All mutating API routes verify JWT server-side before executing
```

---

## Public Pages

### Home (`/`)
- Intro block: name, one-line bio, nav links to each section
- Recent blog posts (2–3 cards)
- Recent concerts (2–3 cards)
- Recent trips (1–2 cards with map thumbnail)
- All pulling from Cosmos via server components (Next.js ISR, revalidate every hour)

### Blog List (`/blog`)
- Filterable by tag
- `PostCard` grid: cover image, title, excerpt, date, tags
- Draft posts not shown (only `status: 'published'`)

### Blog Post (`/blog/[slug]`)
- Full-width cover image
- Title, date, tags
- Body rendered from markdown via `react-markdown` + `rehype-highlight` for code blocks

### Concert List (`/concerts`)
- Filter bar: Year, Artist, Venue
- `ConcertCard` grid: photo/placeholder, date, artist(s), venue, city
- Pagination

### Concert Detail (`/concerts/[id]`)
- Hero: large photo or dark gradient header, date, artist(s)
- Venue link → `/venues/[id]`
- Setlists in `sortOrder`: each block shows artist name + numbered song list with annotations
- Photos gallery (lightbox)
- Ticket Stubs (separate section, displayed as artifacts)
- Links + Notes

### Venues List (`/venues`)
- Leaflet map top half — all venue pins, click → popover with name, concert count, link
- Venue list below, sortable by concert count or alphabetical

### Venue Detail (`/venues/[id]`)
- Name, city, country
- Leaflet map, single pin, zoom 14
- All concerts at this venue

### Travel (`/travel`)
- Full-width Leaflet world map
  - Countries visited: filled polygon or distinct country pin
  - Cities: city-level marker
  - Landmarks: landmark marker
  - Marker colors/icons differ by `type` (country / city / landmark)
  - Click any marker → popover: name, date visited, trip link
- Trips list below map: `TripCard` grid with cover image, title, date range, country flags

### Trip Detail (`/travel/trips/[id]`)
- Title, date range
- Notes (markdown)
- Mini Leaflet map showing only places from this trip
- Place list: name, type badge, date

### Resume (`/resume`)
- Styled web page rendering the `Resume` document from Cosmos
- Sections: Summary, Experience, Education, Skills
- "Download PDF" button → links to `pdfBlobUrl` from Blob Storage
- Print stylesheet included so `Cmd+P` also produces a clean output

### Search (`/search?q=term`)
- Fetches `/api/search-index` on mount, initializes Fuse.js
- Index covers: blog post titles + body, concert artists + songs + notes, trip titles + notes
- Results show type badge (Post / Concert / Trip), title, snippet, link
- Cached in React context after first fetch

---

## Fuse.js Search Config

```typescript
export const fuseOptions = {
  keys: [
    { name: 'title',  weight: 0.5 },
    { name: 'body',   weight: 0.4 },
    { name: 'date',   weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};
```

---

## Travel Map Implementation

```typescript
// components/travel/WorldMap.tsx
// Dynamically imported (ssr: false) — Leaflet requires window

// Tile layer: OpenStreetMap (free, no API key)
// "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Marker types (L.divIcon with styled divs):
//   country  → large amber filled circle
//   city     → medium white circle with amber border
//   landmark → small amber diamond

// On load: map.fitBounds(allPlaceBounds) — auto-zooms to show all visited places
// Click marker → Leaflet popup with: name, type badge, visitedAt, trip link
```

---

## Blog Editor (Admin)

Uses **TipTap** — a headless rich text editor that outputs markdown-compatible HTML.

```typescript
// components/ui/MarkdownEditor.tsx
// Extensions: StarterKit, Markdown, Link, Image, CodeBlock, Highlight
// Toolbar: Bold, Italic, H2, H3, Blockquote, Code, Link, Unordered List, Ordered List
// Output: markdown string stored in BlogPost.content
// Preview toggle: renders content through react-markdown
```

Post editor fields in `/admin/blog/[id]`:
- Title
- Slug (auto-generated from title, manually editable)
- Excerpt
- Cover image upload (`UploadDropzone`)
- Tags (comma-separated input → array)
- Content (TipTap editor)
- Status toggle: Draft / Published
- "Save Draft" and "Publish" buttons

---

## Resume Admin (`/admin/resume`)

- Form fields for all `Resume` document fields
- Experience and Education: add/remove/reorder entries (drag with `@dnd-kit/sortable`)
- Each entry: Organization, Role, Location, Start/End date, Bullets (one per line textarea)
- Skills: add/remove groups, add/remove skills within group
- PDF section: `UploadDropzone` for PDF file → calls `/api/upload/resume-pdf`
- "Save" updates the Cosmos document, "Preview" links to `/resume`

---

## Admin Dashboard (`/admin`)

Four summary cards, one per section:
- Blog: total posts, drafts count, last updated date, "New Post" button
- Concerts: total concerts, last import date, "Run Import" button
- Travel: trips count, countries count, places count, "Add Trip" button
- Resume: last updated date, "Edit Resume" button

---

## Setlist.fm Import Logic (`lib/setlistfm.ts`)

```
1. Fetch all attended setlists paginated from Setlist.fm API
2. Group by (date + setlist.fm venueId)
3. Per group:
   a. Resolve raw venue name → canonical Venue via aliases[] lookup
      If no match: create new Venue with raw name as canonicalName + aliases[0]
   b. Assign setlist sortOrder by startTime if available, else alphabetical by artist
   c. Build Concert document
4. Skip setlists whose setlistFmId already exists in any Concert.setlistFmIds[]
5. Return preview: { newConcerts, skipped, newVenues }
6. If commit=true: upsert all to Cosmos DB
```

---

## Azure Infrastructure

### Resources (all in Resource Group `tedcromwellcom-rg`)

- **Tenant ID:** `71d7bcd9-e2b5-480d-b568-6e362f8350cf`
- **Subscription:** Azure subscription 1


| Resource | Name | Tier | Est. Cost/mo |
|----------|------|------|-------------|
| Static Web Apps | `tedcromwell-swa` | Free | $0.00 |
| Azure Functions (via SWA) | — | Consumption | ~$0.00 |
| Cosmos DB | `tedcromwell-cosmos` | Serverless | ~$0.50–$2.00 |
| Storage Account (GPv2 LRS) | `tedcromwellstore` | Pay-as-you-go | ~$0.20–$2.00 |
| **Total** | | | **~$0.70–$4.00** |

### Blob Storage Containers

| Container | Access | Contents |
|-----------|--------|---------|
| `photos` | Blob (public read) | Concert photos |
| `stubs` | Blob (public read) | Ticket stub images |
| `blog` | Blob (public read) | Blog cover images |
| `travel` | Blob (public read) | Trip cover images |
| `resume` | Blob (public read) | Resume PDF |

Thumbnails generated with `sharp` in the upload Function before storing. Max display width 1200px, thumbnail width 400px.

### `staticwebapp.config.json`

```json
{
  "routes": [
    { "route": "/api/*", "allowedRoles": ["anonymous"] },
    { "route": "/admin", "rewrite": "/admin/index.html" },
    { "route": "/admin/*", "rewrite": "/admin/index.html" }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/_next/*", "/static/*"]
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN"
  }
}
```

---

## Environment Variables

```bash
# Setlist.fm
SETLISTFM_API_KEY=
SETLISTFM_USERNAME=

# Cosmos DB
COSMOS_ENDPOINT=https://tedcromwell-cosmos.documents.azure.com:443/
COSMOS_KEY=
COSMOS_DATABASE=tedcromwell

# Azure Blob Storage
BLOB_CONNECTION_STRING=
BLOB_ACCOUNT_NAME=tedcromwellstore

# Auth
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=        # bcrypt hash — generate: node -e "console.log(require('bcrypt').hashSync('yourpass',10))"
JWT_SECRET=                 # 32+ random chars

# App
NEXT_PUBLIC_BASE_URL=https://www.tedcromwell.com
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "@azure/cosmos": "^4",
    "@azure/storage-blob": "^12",
    "@dnd-kit/core": "^6",
    "@dnd-kit/sortable": "^8",
    "@tiptap/react": "^2",
    "@tiptap/starter-kit": "^2",
    "@tiptap/extension-link": "^2",
    "@tiptap/extension-code-block-highlight": "^2",
    "fuse.js": "^7",
    "leaflet": "^1.9",
    "react-leaflet": "^4",
    "react-markdown": "^9",
    "rehype-highlight": "^7",
    "sharp": "^0.33",
    "bcrypt": "^5",
    "jsonwebtoken": "^9"
  }
}
```

---

## Suggested Build Order

1. **Scaffold** — Next.js app, Tailwind dark theme, `DM Serif Display` + `Inter` fonts, Nav, Footer
2. **Azure resources** — Create resource group, Cosmos DB, Storage Account, SWA; test connections with a seed script
3. **Data layer** — `lib/cosmos.ts`, `lib/blob.ts`, `lib/auth.ts`, `lib/types.ts`
4. **Auth** — Login page, JWT middleware, admin layout guard, dashboard shell
5. **Blog** — Cosmos `posts` container, API routes, TipTap editor, public blog list + post pages
6. **Concerts** — Import logic, concert/venue API routes, public concert list + detail + venue pages, admin editors
7. **Travel** — Trips + places API routes, WorldMap component, public travel + trip pages, admin trip editor
8. **Resume** — Resume API route, ResumeView component, resume admin editor, PDF upload
9. **Home** — Wire together recent items from all sections
10. **Search** — Search index endpoint, Fuse.js, search page, SearchBar component
11. **Polish** — Mobile pass, loading/error states, image optimization, meta tags/OG images per page
