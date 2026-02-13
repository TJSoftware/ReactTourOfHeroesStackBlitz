import { useState, useEffect } from 'react';
import { fetchApod } from './NasaService';
import { useMessages } from './MessageContext';

export default function NasaPhoto() {
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
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
      <h3>NASA Astronomy Picture of the Day</h3>
      <h5>Credit <a href="https://api.nasa.gov/" target="_blank">NASA</a></h5>
      <img src={photo.url} alt={photo.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <p><strong>{photo.title}</strong></p>
      <p style={{ fontSize: '0.9em', color: '#666' }}>{photo.explanation}</p>
    </div>
  );
}