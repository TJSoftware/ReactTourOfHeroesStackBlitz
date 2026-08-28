import { createContext, useState, useContext, useCallback, ReactNode } from 'react';

type MessageContextValue = {
  messages: string[];
  add: (message: string) => void;
  clear: () => void;
};

const MessageContext = createContext<MessageContextValue | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<string[]>([]);

  const add = useCallback((message: string) => {
    setMessages((prev) => {
      // If the message is exactly the same as the last one, skip it
      if (prev.length > 0 && prev[prev.length - 1] === message) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return (
    <MessageContext.Provider value={{ messages, add, clear }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }

  return context;
};