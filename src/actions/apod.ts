'use server';

// In a real-world application, you would typically store the API key in an environment variable for security reasons.
const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
const BASE_URL = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';

export interface ApodData {
  title: string;
  url: string;
  hdurl?: string;
  explanation: string;
  date: string;
  media_type: string;
}

// export async function getApod(date?: string): Promise<ApodData> {
//   const apiKey = NASA_API_KEY || 'DEMO_KEY';
//   const dateParam = date ? `&date=${date}` : '';
  
//   const res = await fetch(`${BASE_URL}?api_key=${apiKey}${dateParam}`, {
//     cache: 'force-cache',
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch APOD data from NASA');
//   }

//   return res.json();
// }

export async function getApod(date?: string): Promise<ApodData> {
  const apiKey = NASA_API_KEY || 'DEMO_KEY';
  const dateParam = date ? `&date=${date}` : '';
  const url = `${BASE_URL}?api_key=${apiKey}${dateParam}`;
  console.log('APOD request:', url);

  const res = await fetch(url, { cache: 'no-store' });
  console.log('APOD status:', res.status, res.statusText);

  const text = await res.text();          // read as text so non-JSON doesn't crash
  console.log('APOD raw body:', text.slice(0, 500));

  if (!res.ok) {
    throw new Error(`NASA APOD failed: ${res.status}`);
  }

  const data = JSON.parse(text);
  console.log('APOD parsed:', Array.isArray(data) ? `array(${data.length})` : data);
  return data;
}