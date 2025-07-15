import { NextRequest, NextResponse } from 'next/server';



export async function GET(
  request: NextRequest,
  { params} : {params: Promise<{ id: string }>}
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'IMDb ID is required' }, { status: 400 });
  }

  try {
    // Fetch the image directly from OMDB's image endpoint
    const imageUrl = `https://img.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`;
    const imageResponse = await fetch(imageUrl, {
      next: {
        revalidate: 3600 // Cache for 1 hour on the server
      }
    });

    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Poster not available' }, { status: 404 });
    }

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