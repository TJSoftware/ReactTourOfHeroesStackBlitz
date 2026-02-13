import { createContext, useState, useContext } from 'react';
import { HEROES as initialData } from './mock-heroes';
import { useMessages } from './MessageContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [heroes, setHeroes] = useState(initialData);
  const { add } = useMessages(); // AppContext can use MessageContext!

  const updateHero = (updatedHero) => {
    setHeroes(prev => prev.map(h => h.id === updatedHero.id ? updatedHero : h));
    add(`HeroService: updated hero id=${updatedHero.id}`);
  };

  const deleteHero = (id) => {
    setHeroes(prev => prev.filter(h => h.id !== id));
    add(`HeroService: deleted hero id=${id}`);
  };

  const addHero = (name) => {
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 11;
    const newHero = { id: newId, name };
    setHeroes(prev => [...prev, newHero]);
    add(`HeroService: added hero id=${newHero.id}`);
  };

  return (
    <AppContext.Provider value={{ heroes, updateHero, deleteHero, addHero }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);