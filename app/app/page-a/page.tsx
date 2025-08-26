'use client';

import { useEffect, useState } from 'react';

export default function PageA() {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/random', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      const data = (await res.json()) as { value: number };
      setValue(data.value);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-8 gap-6">
      <h1 className="text-5xl md:text-7xl font-bold">Page A</h1>
      <div className="space-y-2">
        {loading && <div className="text-muted-foreground">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="text-2xl">Random value: {value}</div>
        )}
      </div>
      <button
        className="w-fit rounded-md border border-border px-3 py-1 bg-card text-card-foreground"
        onClick={load}
      >
        Refresh
      </button>
    </div>
  );
}
