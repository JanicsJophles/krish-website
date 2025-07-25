import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.FORTNITE_API_KEY || !process.env.EPIC_ACCOUNT_ID) {
      throw new Error('Missing required environment variables');
    }

    const statsResponse = await fetch(
      `https://fortnite-api.com/v2/stats/br/v2/${process.env.EPIC_ACCOUNT_ID}`,
      {
        headers: new Headers({
          'Authorization': process.env.FORTNITE_API_KEY
        })
      }
    );

    if (!statsResponse.ok) {
      throw new Error('Failed to fetch Fortnite stats');
    }

    const statsData = await statsResponse.json();

    const cosmeticsResponse = await fetch(
      `https://fortnite-api.com/v2/cosmetics/br/search/all`,
      {
        headers: new Headers({
          'Authorization': process.env.FORTNITE_API_KEY
        })
      }
    );

    let imageUrl = null;
    if (cosmeticsResponse.ok) {
      const cosmeticsData = await cosmeticsResponse.json();
      imageUrl = cosmeticsData?.data?.[0]?.images?.icon;
    }

    const stats = {
      kills: statsData?.data?.stats?.all?.overall?.kills || 0,
      wins: statsData?.data?.stats?.all?.overall?.wins || 0,
      kd: statsData?.data?.stats?.all?.overall?.kd || 0,
      rank: statsData?.data?.battlePass?.level || 0,
      image: imageUrl || '/fortnite-icon.png'
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching Fortnite stats:', error);
    return NextResponse.json({ error: 'Failed to fetch Fortnite stats' }, { status: 500 });
  }
} 