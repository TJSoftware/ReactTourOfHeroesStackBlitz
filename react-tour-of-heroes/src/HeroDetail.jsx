import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { useMessages } from './MessageContext';

export default function HeroDetail() {
  const { heroId } = useParams();
  const navigate = useNavigate();
  const { heroes, updateHero } = useApp();
  const { add } = useMessages();
  
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const foundHero = heroes.find(h => h.id === Number(heroId));
    
    if (foundHero) {
      setHero({ ...foundHero });
      // We only log the "fetched" message here. 
      // By using an empty array [] or just [heroId], we prevent the loop.
      add(`HeroDetail: fetched hero id=${heroId}`);
    }
    
    // STRICT RULE: Only run this when the URL ID changes.
    // Do NOT include 'add' or 'heroes' here, as they trigger re-renders.
  }, [heroId]); 

  const handleSave = () => {
    updateHero(hero);
    navigate(-1);
  };

  if (!hero) return <div>Loading hero details...</div>;

  return (
    <div className="hero-detail">
      <h2>{hero.name.toUpperCase()} Details</h2>
      <div><span>id: </span>{hero.id}</div>
      <div>
        <label>name:
          <input 
            value={hero.name} 
            onChange={(e) => setHero({ ...hero, name: e.target.value })} 
          />
        </label>
      </div>
      <div className="button-group">
        <button onClick={() => navigate(-1)}>go back</button>
        <button onClick={handleSave}>save</button>
      </div>
    </div>
  );
}