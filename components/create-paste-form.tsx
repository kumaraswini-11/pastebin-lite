"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreatePasteForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const body: {
        content: string;
        ttl?: number;
        max_views?: number;
      } = { content };

      if (ttl) {
        body.ttl = Number.parseInt(ttl, 10);
      }

      if (maxViews) {
        body.max_views = Number.parseInt(maxViews, 10);
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create paste");
      }

      const data = await response.json();
      router.push(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Paste</CardTitle>
        <CardDescription>
          Enter your text below and optionally set an expiration time or view
          limit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text here..."
              required
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ttl">TTL (seconds)</Label>
              <Input
                id="ttl"
                type="number"
                min="1"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                placeholder="Optional"
              />
              <p className="text-muted-foreground text-xs">
                Time until paste expires
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxViews">Max Views</Label>
              <Input
                id="maxViews"
                type="number"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                placeholder="Optional"
              />
              <p className="text-muted-foreground text-xs">
                Maximum number of views
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !content}
            className="w-full"
          >
            {isSubmitting ? "Creating..." : "Create Paste"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
