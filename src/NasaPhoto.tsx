import { useState, useEffect } from 'react';
import { fetchApod } from './NasaService';
import { useMessages } from './MessageContext';

type NasaPhotoData = {
  url: string;
  title: string;
  explanation: string;
};

export default function NasaPhoto() {
  const [photo, setPhoto] = useState<NasaPhotoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { add } = useMessages();

  useEffect(() => {
    fetchApod()
      .then(data => setPhoto(data))
      .catch(err => setError(err.message));
    
      add(`APOD: NASA astronomy picture of the day fetched`);
  }, []);

  if (error) return <div className="error">Error: {error}</div>;
  if (!photo) return <div>Loading Astronomy Picture...</div>;

  return (
    <div className="nasa-container" style={{ marginTop: '20px', borderTop: '2px solid #eee' }}>
      <h1>NASA Astronomy Picture of the Day</h1>
      <p>Because I enjoy looking at pictures related to space, this is the first public example that I am doing with this website.</p>
      <h5>Credit <a href="https://api.nasa.gov/" target="_blank">NASA</a></h5>
      <h1>{photo.title}</h1>
      <img src={photo.url} alt={photo.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <p style={{ fontSize: '0.9em', color: '#666' }}>{photo.explanation}</p>
    </div>
  );
}