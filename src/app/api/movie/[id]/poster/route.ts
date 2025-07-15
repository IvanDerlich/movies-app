import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id: imdbId } = await params;

  if (!imdbId) {
    return NextResponse.json({ error: 'IMDb ID is required' }, { status: 400 });
  }

  try {
    // First, get the poster URL from OMDB
    const omdbResponse = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`,
      {
        next: {
          revalidate: 3600 // Cache for 1 hour on the server
        }
      }
    );
    const data = await omdbResponse.json();
    const posterUrl = data.Poster;

    if (!posterUrl || posterUrl === 'N/A') {
      return NextResponse.json({ error: 'Poster not available' }, { status: 404 });
    }

    // Fetch the image itself
    const imageResponse = await fetch(posterUrl, {
      next: {
        revalidate: 3600 // Cache for 1 hour on the server
      }
    });
    const imageBuffer = await imageResponse.arrayBuffer();
    const res = new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    return res;
  } catch (error) {
    console.error('Error fetching movie poster:', error);
    return NextResponse.json({ error: 'Failed to fetch movie poster' }, { status: 500 });
  }
} 