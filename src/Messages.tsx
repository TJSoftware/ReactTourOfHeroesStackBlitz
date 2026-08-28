import { useMessages } from './MessageContext';

export default function Messages() {
  const { messages, clear } = useMessages();
  if (!messages.length) return <div>No messages yet...</div>;

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <button className="clear" onClick={clear}>Clear messages</button>
      {messages.map((msg, i) => <div key={i}>{msg}</div>)}
    </div>
  );
}