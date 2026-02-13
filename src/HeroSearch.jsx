import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from './AppContext';
import { useMessages } from './MessageContext';

export default function HeroSearch() {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const { heroes } = useApp(); // Access the global list
  const { add } = useMessages();

  // Create a "memory" of the last term we actually logged
  const lastLoggedTerm = useRef('');

  useEffect(() => {
    // 1. Clear results if search term is empty
    if (!term.trim()) {
      setResults([]);
      lastLoggedTerm.current = '';
      return;
    }

    // 2. Set a timer to search only after typing stops (300ms)
    const timer = setTimeout(() => {
      const filtered = heroes.filter(h => 
        h.name.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
      
      if (term !== lastLoggedTerm.current) {
        add(`HeroSearch: found ${filtered.length} heroes matching "${term}"`);
        lastLoggedTerm.current = term; // Update the memory
      }
    }, 300);

    // 3. Cleanup: If the user types again, cancel the previous timer
    return () => clearTimeout(timer);
  }, [term, heroes, add]);

  return (
    <div id="search-component">
      <h4><label htmlFor="search-box">Hero Search</label></h4>
      <input 
        id="search-box" 
        value={term} 
        onChange={(e) => setTerm(e.target.value)} 
        placeholder="Search for a hero..."
      />

      <ul className="search-result">
        {results.map(hero => (
          <li key={hero.id}>
            <Link to={`/detail/${hero.id}`}>
              {hero.name}
            </Link>
          </li>
        ))}
        {term && results.length === 0 && (
          <li className="no-results">No heroes match your search</li>
        )}
      </ul>
    </div>
  );
}