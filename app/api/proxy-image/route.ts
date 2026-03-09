import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get('url');

        if (!url) {
            return new NextResponse('URL parameter is required', { status: 400 });
        }

        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        const blob = await response.blob();
        const headers = new Headers();
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=31536000');
        // Critical: allow the canvas to safely process the image data
        headers.set('Access-Control-Allow-Origin', '*');

        return new NextResponse(blob, { headers });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
