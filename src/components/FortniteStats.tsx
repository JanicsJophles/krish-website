'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FortniteStats {
  kills: number;
  wins: number;
  kd: number;
  rank: string;
}

export default function FortniteStats() {
  const [stats, setStats] = useState<FortniteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/fortnite-stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching Fortnite stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        Loading stats...
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src="/fortnite.webp"
              alt="Fortnite"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          <h3 className="text-lg font-semibold whitespace-nowrap">Fortnite Stats</h3>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-gray-400">Kills</p>
            <p className="font-bold">{stats.kills}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Wins</p>
            <p className="font-bold">{stats.wins}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">K/D</p>
            <p className="font-bold">{stats.kd.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Level</p>
            <p className="font-bold">{stats.rank}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 