import { createContext, useState, useContext, type ReactNode } from 'react';
import { HEROES as initialData } from './mock-heroes';
import { useMessages } from './MessageContext';

type Hero = {
  id: number;
  name: string;
};

type AppContextType = {
  heroes: Hero[];
  updateHero: (updatedHero: Hero) => void;
  deleteHero: (id: number) => void;
  addHero: (name: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [heroes, setHeroes] = useState<Hero[]>(initialData);
  const messageApi = useMessages() as { add: (message: string) => void } | undefined;
  const add = messageApi?.add ?? (() => undefined);

  const updateHero = (updatedHero: Hero) => {
    setHeroes(prev => prev.map(h => h.id === updatedHero.id ? updatedHero : h));
    add(`HeroService: updated hero id=${updatedHero.id}`);
  };

  const deleteHero = (id: number) => {
    setHeroes(prev => prev.filter(h => h.id !== id));
    add(`HeroService: deleted hero id=${id}`);
  };

  const addHero = (name: string) => {
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 11;
    const newHero: Hero = { id: newId, name };
    setHeroes(prev => [...prev, newHero]);
    add(`HeroService: added hero id=${newHero.id}`);
  };

  return (
    <AppContext.Provider value={{ heroes, updateHero, deleteHero, addHero }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};