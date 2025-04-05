// app/api/generate-code/route.ts
import { generateCodeWithGemini } from '@/services/geminiService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json();
    
    if (!prompt || !language) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'API key not configured' },
        { status: 500 }
      );
    }

    const code = await generateCodeWithGemini(prompt, language, apiKey);
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error in generate-code API:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to generate code' },
      { status: 500 }
    );
  }
}