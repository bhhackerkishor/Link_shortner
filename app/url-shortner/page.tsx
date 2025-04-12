'use client';

import { useState } from 'react';

export default function UrlShortenerPage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ originalUrl: url }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(res.json())
    setShortUrl(data.shortUrl);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your URL"
          className="border px-4 py-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Shorten
        </button>
      </form>
      {shortUrl && (
        <p className="mt-2 text-green-600">
          Short URL:{' '}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}
