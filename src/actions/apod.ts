'use server';

// In a real-world application, you would typically store the API key in an environment variable for security reasons.
const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

export interface ApodData {
  title: string;
  url: string;
  hdurl?: string;
  explanation: string;
  date: string;
  media_type: string;
}

export async function getApod(date?: string): Promise<ApodData> {
  const apiKey = NASA_API_KEY || 'DEMO_KEY';
  const dateParam = date ? `&date=${date}` : '';
  
  const res = await fetch(`${BASE_URL}?api_key=${apiKey}${dateParam}`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch APOD data from NASA');
  }

  return res.json();
}