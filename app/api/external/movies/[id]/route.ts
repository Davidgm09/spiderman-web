import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`🔍 Fetching movie with ID: ${id}`);

    const tmdbApiKey = process.env.TMDB_API_KEY

    if (!tmdbApiKey) {
      console.error('❌ TMDB API key not configured')
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      )
    }

    // Fetch movie details including credits
    const [movieResponse, creditsResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=es-ES`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}`)
    ]);

    if (!movieResponse.ok) {
      console.error(`❌ TMDB API error: ${movieResponse.status} ${movieResponse.statusText}`)
      return NextResponse.json(
        { error: `Movie not found: ${movieResponse.status}` },
        { status: movieResponse.status }
      )
    }

    const [movieData, creditsData] = await Promise.all([
      movieResponse.json(),
      creditsResponse.ok ? creditsResponse.json() : { cast: [], crew: [] }
    ]);

    console.log(`✅ Successfully fetched movie ${id}`);

    // Combine movie data with credits
    const enhancedMovie = {
      ...movieData,
      credits: creditsData,
      // Generate affiliate links
      amazon_links: [
        {
          platform: '4K Blu-ray',
          url: `https://www.amazon.com/s?k=${encodeURIComponent(movieData.title + ' 4K blu-ray')}&tag=${process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20'}`,
        },
        {
          platform: 'Digital HD',
          url: `https://www.amazon.com/s?k=${encodeURIComponent(movieData.title + ' digital')}&tag=${process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20'}`,
        }
      ],
      digital_stores: [
        {
          platform: 'Amazon Prime Video',
          url: `https://www.amazon.com/s?k=${encodeURIComponent(movieData.title)}&i=instant-video&tag=${process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20'}`,
        },
        {
          platform: 'Apple TV',
          url: `https://tv.apple.com/search?term=${encodeURIComponent(movieData.title)}`,
        }
      ]
    };
    
    return NextResponse.json({
      movie: enhancedMovie
    })

  } catch (error) {
    console.error('❌ Error in TMDB Movies API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}