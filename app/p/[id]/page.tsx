import { notFound } from "next/navigation";

import { PasteView } from "@/components/paste-view";
import { getPaste } from "@/lib/paste";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    notFound();
  }

  // Check if paste is expired
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    return (
      <main className="bg-background min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="border-destructive bg-destructive/10 rounded-lg border p-6 text-center">
            <h1 className="text-destructive text-2xl font-bold">
              Paste Expired
            </h1>
            <p className="text-muted-foreground mt-2">
              This paste has expired and is no longer available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Check if paste has reached max views
  if (paste.max_views !== null && paste.view_count >= paste.max_views) {
    return (
      <main className="bg-background min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="border-destructive bg-destructive/10 rounded-lg border p-6 text-center">
            <h1 className="text-destructive text-2xl font-bold">
              Maximum Views Reached
            </h1>
            <p className="text-muted-foreground mt-2">
              This paste has reached its maximum view limit and is no longer
              available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <PasteView paste={paste} />;
}
