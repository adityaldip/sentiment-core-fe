import { NextRequest, NextResponse } from 'next/server';

const POSTS_API_URL = process.env.NEXT_PUBLIC_POSTS_API_URL || 'http://46.250.233.83:9013';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = new URLSearchParams();
    
    // Forward query parameters
    if (searchParams.get('limit')) params.append('limit', searchParams.get('limit')!);
    if (searchParams.get('offset')) params.append('offset', searchParams.get('offset')!);
    if (searchParams.get('platform')) params.append('platform', searchParams.get('platform')!);
    if (searchParams.get('source')) params.append('source', searchParams.get('source')!);

    const url = `${POSTS_API_URL}/api/v1/posts${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control if needed
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    );
  }
}
