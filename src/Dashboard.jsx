import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from './AppContext';
import { useMessages } from './MessageContext';
import HeroSearch from './HeroSearch';

export default function Dashboard() {
  const { heroes } = useApp();
  const { add } = useMessages();

  // Get the 2nd through 5th heroes
  const topHeroes = heroes.slice(1, 5);

  useEffect(() => {
    add('DashboardComponent: fetched heroes');
  }, []); // Run once on mount

  return (
    <div className="dashboard">
      <h2>Top Heroes</h2>
      <div className="grid">
        {topHeroes.map(hero => (
          <Link key={hero.id} to={`/detail/${hero.id}`} className="col-1-4">
            <div className="module hero">
              <h4>{hero.name}</h4>
            </div>
          </Link>
        ))}
      </div>

      <HeroSearch />
    </div>
  );
}