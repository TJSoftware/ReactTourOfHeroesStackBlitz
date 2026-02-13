import { createContext, useState, useContext } from 'react';

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const add = (message) => setMessages((prev) => [...prev, message]);
  const clear = () => setMessages([]);

  return (
    <MessageContext.Provider value={{ messages, add, clear }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);