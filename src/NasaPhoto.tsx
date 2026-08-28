import { useState, useEffect, useMemo } from 'react';
import { useMessages } from './MessageContext';

const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

type NasaPhotoData = {
  url: string;
  title: string;
  explanation: string;
};

export default function NasaPhoto() {
  const {add} = useMessages();
  const [photoData, setPhotoData] = useState<NasaPhotoData | null>(null);

  // 1. ASYNC FETCH: Managed by useEffect (or React 19 Action/Resource)
  useEffect(() => {
    async function fetchPhoto() {
      const res = await fetch(`${BASE_URL}?api_key=${NASA_API_KEY}`);
      const data = await res.json();
      add(`APOD: NASA astronomy picture of the day fetched`);
      setPhotoData(data); // Triggers re-render once data arrives
    }
    fetchPhoto();
  }, []);

  // 2. HEAVY SYNCHRONOUS CALCULATION: Perfect place for useMemo!
  // Runs ONLY after photoData exists, and re-calculates ONLY when photoData changes
  const processedMetadata = useMemo(() => {
    if (!photoData?.explanation) return null;

    return {
      wordCount: photoData.explanation.split(/\s+/).length,
      readTimeMinutes: Math.ceil(photoData.explanation.split(/\s+/).length / 200),
      detectedKeywords: photoData.explanation.match(/\b(galaxy|nebula|star|planet|telescope|orbit)\b/gi) || [],
    };
  }, [photoData]);

  if (!photoData) return <div>Loading photo...</div>;

  return (
    <div className="nasa-container" style={{ marginTop: '20px', borderTop: '2px solid #eee' }}>
      <h1>NASA Astronomy Picture of the Day</h1>
      <p>Because I enjoy looking at pictures related to space, this is the first public example that I am doing with this website.</p>
      <h5>Credit <a href="https://api.nasa.gov/" target="_blank">NASA</a></h5>
      <h1>{photoData.title}</h1>
      <img src={photoData.url} alt={photoData.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <p style={{ fontSize: '0.9em', color: '#666' }}>{photoData.explanation}</p>
    </div>
  );
}