import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-3xl font-bold">Paste Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The paste you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/" className="mt-6 inline-block">
            <button>Go Home</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
