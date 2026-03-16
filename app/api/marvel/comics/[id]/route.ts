import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`🔍 Fetching comic with ID: ${id}`);

    const publicKey = process.env.MARVEL_PUBLIC_KEY
    const privateKey = process.env.MARVEL_PRIVATE_KEY

    if (!publicKey || !privateKey) {
      console.error('❌ Marvel API keys not configured')
      return NextResponse.json(
        { error: 'Marvel API keys not configured' },
        { status: 500 }
      )
    }

    const timestamp = Date.now().toString()
    const hash = crypto
      .createHash('md5')
      .update(timestamp + privateKey + publicKey)
      .digest('hex')

    const marvelUrl = new URL(`https://gateway.marvel.com/v1/public/comics/${id}`)
    marvelUrl.searchParams.append('ts', timestamp)
    marvelUrl.searchParams.append('apikey', publicKey)
    marvelUrl.searchParams.append('hash', hash)

    console.log(`🌐 Making request to Marvel API for comic ${id}...`)
    
    const response = await fetch(marvelUrl.toString(), {
      headers: {
        'User-Agent': 'Spider-World/1.0',
      },
    })

    if (!response.ok) {
      console.error(`❌ Marvel API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Marvel API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.data || !data.data.results || data.data.results.length === 0) {
      console.warn(`⚠️ Comic ${id} not found`)
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      )
    }

    console.log(`✅ Successfully fetched comic ${id}`)
    
    return NextResponse.json({
      results: data.data.results,
      count: data.data.count,
      total: data.data.total
    })

  } catch (error) {
    console.error('❌ Error in Marvel Comics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}