import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the JSON request body
    const { prompt } = await req.json();

    // Construct the Pollinations AI URL
    const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=You are SEO expert and you can answer anything about SEO.`;

    // Make the request to Pollinations AI
    const pollinationsResponse = await fetch(pollinationsUrl, {
      method: 'GET',
    });

    if (!pollinationsResponse.ok) {
      throw new Error('Failed to fetch from Pollinations AI');
    }

    // Get the text response from Pollinations
    const data = await pollinationsResponse.text();

    // Return the data as JSON
    return NextResponse.json({ response: data });
  } catch (error) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}