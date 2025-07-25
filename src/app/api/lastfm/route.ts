import { NextResponse } from 'next/server';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = 'krishanator';

export async function GET() {
  try {
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Last.fm');
    }

    const data = await response.json();
    const track = data.recenttracks.track[0];
    
    const isPlaying = track['@attr']?.nowplaying === 'true';

    return NextResponse.json({
      isPlaying,
      track: {
        name: track.name,
        artist: track.artist['#text'],
        album: track.album['#text'],
        image: track.image[2]['#text'],
        url: track.url
      }
    });
  } catch (error) {
    console.error('Last.fm API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currently playing track' },
      { status: 500 }
    );
  }
} 