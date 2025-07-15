import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: imdbId } = await params;

  if (!imdbId) {
    return NextResponse.json({ error: 'IMDb ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`,
      {
        next: {
          revalidate: 3600 // Cache for 1 hour
        }
      }
    );
    
    const data = await response.json();
    const res = NextResponse.json(data);
    // Cache for 1 hour in the client's browser
    res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
} 