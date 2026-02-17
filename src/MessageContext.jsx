import { createContext, useState, useContext, useCallback } from 'react';

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const add = useCallback((message) => {
    setMessages((prev) => {
      // If the message is exactly the same as the last one, skip it
      if (prev.length > 0 && prev[prev.length - 1] === message) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);
  const clear = () => setMessages([]);

  return (
    <MessageContext.Provider value={{ messages, add, clear }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);