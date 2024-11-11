'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMusic, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
}

interface NowPlayingData {
  isPlaying: boolean;
  track: Track;
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch('/api/lastfm');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load track data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm"
    >
      <div className="flex items-start space-x-4">
        {data.track.image ? (
          <div className="relative w-16 h-16">
            {/* Record grooves effect */}
            <div 
              className="absolute inset-0 rounded-full z-10 pointer-events-none"
              style={{
                background: 'repeating-radial-gradient(circle at center, rgba(0,0,0,0) 0px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0) 4px)',
              }}
            />
            
            {/* Album art */}
            <motion.div
              animate={{ rotate: data.isPlaying ? 360 : 0 }}
              transition={data.isPlaying ? {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              } : {
                duration: 0.5
              }}
              className="w-full h-full rounded-full overflow-hidden border-4 border-gray-800 dark:border-gray-700"
            >
              <Image
                src={data.track.image}
                alt={`${data.track.album} album art`}
                className="w-full h-full object-cover"
                width={64}
                height={64}
              />
            </motion.div>

            {/* Center hole */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-800 dark:bg-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FaMusic className="text-gray-400 text-xl" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {data.isPlaying && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
              {data.isPlaying ? 'Now playing' : 'Last played track'}
            </p>
          </div>
          
          <a
            href={data.track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate text-left">
              {data.track.name}
            </h3>
          </a>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate text-left">
            {data.track.artist}
          </p>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate text-left">
            {data.track.album}
          </p>
        </div>
      </div>
    </motion.div>
  );
} 