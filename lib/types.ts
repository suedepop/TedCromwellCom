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
  lastPostedToFacebookAt?: string;
  lastPostedToFacebookUrl?: string;
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
  /** SHA-256 of the original uploaded bytes (hex). Used to skip duplicate
   *  re-uploads of the same file. Optional because photos uploaded before
   *  the dedup feature landed don't have one. */
  hash?: string;
  /** Original filename at upload time (basename only). Optional because
   *  photos uploaded before this field existed don't have one. Used for
   *  filename-based sorting in the admin editor. */
  filename?: string;
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
  slug?: string;
  venueId: string;
  venueNameRaw: string;
  eventName?: string;
  date: string;
  city: string;
  country: string;
  setlists: Setlist[];
  writeUp?: string;
  photos: Photo[];
  featuredPhotoId?: string;
  videoUrls: string[];
  ticketStubs: TicketStub[];
  links: Link[];
  notes: string;
  setlistFmIds: string[];
  importedAt: string;
  updatedAt: string;
  lastPostedToFacebookAt?: string;
  lastPostedToFacebookUrl?: string;
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
  slug?: string;
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
  lastPostedToFacebookAt?: string;
  lastPostedToFacebookUrl?: string;
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

export interface RecordArtist {
  id: number;
  name: string;
}

export interface RecordLabel {
  name: string;
  catno?: string;
}

export interface VinylRecord {
  id: string;                       // Cosmos id (we use the discogs release id stringified)
  slug: string;
  discogsReleaseId: number;
  discogsMasterId?: number;
  title: string;
  artists: RecordArtist[];
  year?: number;
  formats: string[];                // flattened format descriptors ["LP", "Album", "Reissue"]
  primaryFormat: string;            // e.g. "Vinyl, LP" — for display
  labels: RecordLabel[];
  genres: string[];
  styles: string[];
  coverImageUrl?: string;
  thumbnailUrl?: string;
  resourceUrl?: string;             // discogs API URL
  permalinkUrl: string;             // public discogs page
  notes?: string;
  writeUp?: string;                 // public markdown body, preserved across imports
  hidden?: boolean;                 // exclude from public listings
  addedToCollectionAt?: string;
  importedAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;                       // === slug (also the Cosmos partition key value)
  slug: string;
  name: string;                     // canonical display name
  aliases?: string[];               // alternate spellings that should resolve to this artist
  musicbrainzId?: string;           // MBID (UUID), e.g. "a74b1b7f-71a5-4011-9441-d0b5e4122711"
  setlistFmMbid?: string;           // setlist.fm uses MBIDs; usually equals musicbrainzId, kept separate in case they ever diverge
  discogsArtistId?: number;         // numeric Discogs artist id, e.g. 12345
  description?: string;             // public markdown bio / write-up
  imageUrl?: string;                // optional artist portrait URL (Blob, Wikipedia, etc.)
  notes?: string;                   // private admin notes
  createdAt: string;
  updatedAt: string;
}

export interface Park {
  id: string;                       // === slug (also the Cosmos partition key value)
  slug: string;
  name: string;                     // canonical display name
  aliases?: string[];               // alternate spellings that should resolve to this park
  city?: string;
  state?: string;
  country: string;
  lat?: number;
  lng?: number;
  url?: string;                     // official park website
  externalIds?: {
    coasterCountId?: number;        // numeric park id at coaster-count.com (data-park-id)
    rcdbId?: number;                // numeric park id at rcdb.com
  };
  description?: string;             // public markdown write-up
  imageUrl?: string;
  notes?: string;                   // private admin notes
  closed?: boolean;                 // permanently closed?
  closedYear?: number;
  createdAt: string;
  updatedAt: string;
}

export type CoasterType =
  | "steel"
  | "wood"
  | "hybrid"
  | "kiddie"
  | "powered"
  | "launched"
  | "inverted"
  | "flying"
  | "mountain"
  | "water"
  | "other";

export type CoasterStatus = "open" | "closed" | "sbno" | "under-construction" | "relocated";

export interface CoasterStats {
  heightFeet?: number;
  dropFeet?: number;
  lengthFeet?: number;
  topSpeedMph?: number;
  inversions?: number;
  durationSeconds?: number;
  maxG?: number;
}

export interface Coaster {
  id: string;                       // === slug (also the Cosmos partition key value)
  slug: string;
  name: string;                     // canonical display name
  parkId: string;                   // → Park.id (== slug)
  externalIds?: {
    coasterCountId?: number;        // numeric coaster id at coaster-count.com (e.g. c15986 → 15986)
    rcdbId?: number;                // numeric coaster id at rcdb.com
  };
  manufacturer?: string;
  type?: CoasterType;
  openedYear?: number;
  status?: CoasterStatus;
  stats?: CoasterStats;
  description?: string;             // public markdown — author-voice or neutral encyclopedic
  writeUp?: string;                 // public markdown body, reserved for personal write-ups (mirrors VinylRecord.writeUp)
  coverImageUrl?: string;
  photos?: Photo[];
  notes?: string;                   // private admin notes
  createdAt: string;
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
