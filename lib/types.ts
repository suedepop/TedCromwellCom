export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;                 // Markdown body (empty for HTML posts)
  postType?: "markdown" | "html";  // defaults to "markdown"
  htmlUrl?: string;                // Blob URL for a one-page HTML post
  coverImageUrl?: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
  updatedAt: string;
}

export interface Song {
  sortOrder: number;
  name: string;
  info?: string;
  cover?: string;
  tape?: boolean;
}

export interface Setlist {
  sortOrder: number;
  artist: string;
  setlistFmId: string;
  songs: Song[];
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
  label?: string;
  uploadedAt: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface Concert {
  id: string;
  pk: string;
  venueId: string;
  venueNameRaw: string;
  eventName?: string;
  date: string;
  city: string;
  country: string;
  setlists: Setlist[];
  photos: Photo[];
  featuredPhotoId?: string;
  videoUrls: string[];
  ticketStubs: TicketStub[];
  links: Link[];
  notes: string;
  setlistFmIds: string[];
  importedAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  canonicalName: string;
  city: string;
  state?: string;
  country: string;
  aliases: string[];
  lat?: number;
  lng?: number;
  url?: string;
  notes?: string;
  description?: string;           // Markdown — public write-up
  venueType?: "club" | "theater" | "arena" | "stadium" | "amphitheater" | "festival" | "bar" | "other";
  capacity?: number;
  openedYear?: number;
  closedYear?: number;            // omit if still open
  wikipediaUrl?: string;
}

export interface TravelEntry {
  id: string;
  locationName: string;
  startDate: string;      // YYYY-MM-DD
  endDate?: string;       // YYYY-MM-DD — blank = same as start
  city?: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  content: string;        // Markdown blog post
  photos: Photo[];
  featuredPhotoId?: string;
  publishedAt?: string;   // ISO — controls ordering
  updatedAt: string;
}

export interface ResumeEntry {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
  sortOrder: number;
}

export interface SkillGroup {
  category: string;
  skills: string[];
  sortOrder: number;
}

export interface Resume {
  id: "resume";
  pk: "resume";
  name: string;
  tagline: string;
  email: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  summary: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  skills: SkillGroup[];
  pdfBlobUrl?: string;
  updatedAt: string;
}

export interface SearchIndexEntry {
  id: string;
  type: "post" | "concert" | "trip";
  title: string;
  date?: string;
  body: string;
  url: string;
}
