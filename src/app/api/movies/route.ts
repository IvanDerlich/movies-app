import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const encodedSearch = encodeURIComponent(query.trim());
    const responseFromOMDB = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodedSearch}`, {
        // Cache the response for 1 hour in the next.js server
        next: {
          revalidate: 3600
        }
      }
    );
    
    const data = await responseFromOMDB.json();
    const res = NextResponse.json(data);
    // Cache for 1 hour in the client's browser
    res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
} 