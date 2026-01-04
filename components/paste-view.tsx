"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Paste } from "@/lib/types";

interface PasteViewProps {
  paste: Paste;
}

export function PasteView({ paste }: PasteViewProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Increment view count when component mounts
    fetch(`/api/pastes/${paste.id}`)
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to increment view count");
        }
      })
      .catch((err) => {
        console.error("Error incrementing view count:", err);
      });
  }, [paste.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(" Failed to copy:", err);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const viewsRemaining =
    paste.max_views !== null ? paste.max_views - paste.view_count - 1 : null;

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-foreground font-serif text-3xl font-bold tracking-tight">
              Paste View
            </h1>
            <Link href="/">
              <Button variant="outline">Create New</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>Paste Content</CardTitle>
                  <CardDescription>
                    Created {formatDate(paste.created_at)}
                  </CardDescription>
                </div>
                <Button onClick={handleCopy} variant="secondary" size="sm">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 font-mono text-sm leading-relaxed">
                {paste.content}
              </pre>

              <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                {paste.expires_at && (
                  <div>
                    <span className="font-medium">Expires:</span>{" "}
                    {formatDate(paste.expires_at)}
                  </div>
                )}
                {viewsRemaining !== null ? (
                  <div>
                    <span className="font-medium">Views remaining:</span>{" "}
                    {viewsRemaining}
                  </div>
                ) : (
                  <div>
                    <span className="font-medium">Views count:</span>{" "}
                    {paste.view_count}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
