export interface Paste {
  id: string;
  content: string;
  max_views: number | null;
  view_count: number;
  expires_at: string | null;
  created_at: string;
}

export interface CreatePasteInput {
  content: string;
  ttl?: number; // in seconds
  max_views?: number;
}
