const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

export const fetchApod = async () => {
  const response = await fetch(`${BASE_URL}?api_key=${NASA_API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch NASA data');
  return response.json();
};