import { NextResponse } from "next/server";

import { createPaste } from "@/lib/paste";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, ttl, max_views } = body;

    // Validate content
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 },
      );
    }

    // Validate ttl if provided
    if (ttl !== undefined && (typeof ttl !== "number" || ttl <= 0)) {
      return NextResponse.json(
        { error: "TTL must be a positive number" },
        { status: 400 },
      );
    }

    // Validate max_views if provided
    if (
      max_views !== undefined &&
      (typeof max_views !== "number" || max_views <= 0)
    ) {
      return NextResponse.json(
        { error: "max_views must be a positive number" },
        { status: 400 },
      );
    }

    const paste = await createPaste(content, ttl, max_views);

    return NextResponse.json(
      {
        id: paste.id,
        url: `/p/${paste.id}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating paste:", error);
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 },
    );
  }
}
