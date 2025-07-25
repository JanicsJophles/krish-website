'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function YouTubeToMp3() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleConvert() {
    setError(null);
    setSuccessMessage(null);

    if (!url.trim()) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/convert?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Conversion failed.');
      }

      const downloadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${data.url}`);
      const blob = await downloadRes.blob();

      const tempUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = tempUrl;
      a.download = data.file || 'audio.mp3';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(tempUrl);

      setSuccessMessage(`Download started: ${data.file}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  const isUrlValid = url.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-center">
            YouTube to MP3
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />

          <Button
            onClick={handleConvert}
            disabled={!isUrlValid || loading}
            className="w-full"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? 'Converting...' : 'Convert to MP3'}
          </Button>

          {error && (
            <p className="text-destructive font-medium text-center">{error}</p>
          )}

          {successMessage && (
            <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 rounded text-green-700 dark:text-green-300 text-center font-semibold">
              {successMessage}
            </div>
          )}
        </CardContent>
      </Card>
      <footer className="mt-8 text-sm text-muted-foreground">
        Powered by Your Python Backend
      </footer>
    </div>
  );
}
