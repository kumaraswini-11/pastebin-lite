"use client";

import { CreatePasteForm } from "@/components/create-paste-form";

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-foreground font-serif text-4xl font-bold tracking-tight">
              Pastebin Lite
            </h1>
            <p className="text-muted-foreground">
              Share text snippets with optional expiration and view limits
            </p>
          </div>

          <CreatePasteForm />
        </div>
      </div>
    </main>
  );
}
