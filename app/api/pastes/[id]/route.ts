import { NextResponse } from "next/server";

import { getPaste, incrementViewCount } from "@/lib/paste";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Fetch the paste
    const paste = await getPaste(id);

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // Check if paste is expired
    if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
      return NextResponse.json({ error: "Paste has expired" }, { status: 410 });
    }

    // Check if paste has reached max views
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return NextResponse.json(
        { error: "Paste has reached maximum views" },
        { status: 410 },
      );
    }

    // Increment view count
    await incrementViewCount(id);

    return NextResponse.json({
      id: paste.id,
      content: paste.content,
      created_at: paste.created_at,
      expires_at: paste.expires_at,
      max_views: paste.max_views,
      view_count: paste.view_count + 1, // Return the incremented count
    });
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "Failed to fetch paste" },
      { status: 500 },
    );
  }
}
