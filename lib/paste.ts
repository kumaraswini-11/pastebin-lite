import { createClient } from "@/lib/supabase/server";
import type { Paste } from "@/lib/types";

export async function createPaste(
  content: string,
  ttl?: number,
  max_views?: number,
): Promise<Paste> {
  const supabase = await createClient();

  const expires_at = ttl
    ? new Date(Date.now() + ttl * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from("pastes")
    .insert([
      {
        content,
        expires_at,
        max_views: max_views || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating paste:", error);
    throw new Error(error.message);
  }

  return data as Paste;
}

export async function getPaste(id: string): Promise<Paste | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pastes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Error fetching paste:", error);
    throw new Error(error.message);
  }

  return data as Paste;
}

export async function incrementViewCount(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_paste_view_count", {
    paste_id: id,
  });

  if (error) {
    console.error("Error incrementing view count:", error);
    throw new Error(error.message);
  }
}
