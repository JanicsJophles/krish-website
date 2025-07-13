'use client';

import { useState } from 'react';

export default function YouTubeToMp3() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleConvert() {
    setError(null);
    setSuccessMessage(null);

    if (!url.trim()) {
      setError('Please enter a YouTube URL.');
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

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-12">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTube to MP3 Converter</h1>

      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        disabled={loading}
      />

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Converting...' : 'Convert to MP3'}
      </button>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {successMessage && (
        <div className="mt-6 p-4 bg-green-100 rounded border border-green-400 text-center">
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}
    </div>
  );
}
