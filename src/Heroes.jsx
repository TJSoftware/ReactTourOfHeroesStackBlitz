import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from './AppContext';
import { useMessages } from './MessageContext';

export default function Heroes() {
  const { heroes, addHero, deleteHero } = useApp();
  const { add } = useMessages();
  const [newHeroName, setNewHeroName] = useState('');

  useEffect(() => {
    add('HeroesComponent: fetched heroes');
  }, []);

  const handleAdd = () => {
    if (!newHeroName.trim()) return;
    addHero(newHeroName);
    setNewHeroName('');
  };

  return (
    <div>
      <h2>My Heroes</h2>
      <div className="add-hero-area">
        <label>Hero name: </label>
        <input 
          value={newHeroName} 
          onChange={(e) => setNewHeroName(e.target.value)} 
        />
        <button onClick={handleAdd}>Add Hero</button>
      </div>

      <ul className="heroes">
        {heroes.map((hero) => (
          <li key={hero.id}>
            <Link to={`/detail/${hero.id}`}>
              <span className="badge">{hero.id}</span> {hero.name}
            </Link>
            <button 
              className="delete" 
              onClick={(e) => {
                e.preventDefault();
                if(window.confirm(`Delete ${hero.name}?`)) deleteHero(hero.id);
              }}
            >x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}