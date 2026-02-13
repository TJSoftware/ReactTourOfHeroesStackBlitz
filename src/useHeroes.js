import { useState, useEffect } from 'react';
import { HEROES } from './mock-heroes';

export function useHeroes() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be: fetch('api/heroes')
    setTimeout(() => {
      setHeroes(HEROES);
      setLoading(false);
    }, 500);
  }, []);

  const getHero = (id) => HEROES.find(h => h.id === parseInt(id));

  return { heroes, loading, getHero };
}