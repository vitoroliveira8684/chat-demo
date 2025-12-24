import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader'; // Corrigido o nome do import
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); // Removido o "a"
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    setLoading(true);

    // Adiciona a mensagem do usuário ao estado
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);

    try {
      // Envia a mensagem para o backend em Python
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Erro ao se comunicar com o backend');
      }

      const data = await response.json();

      // Adiciona a resposta do assistente ao estado
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: data.reply, sender: 'assistant' },
      ]);
    } catch (error) {
      console.error('Erro:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Erro ao obter resposta do servidor.', sender: 'assistant' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <ChatHeader />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage role={msg.sender} content={msg.text} key={i} />
        ))}
        {loading && <div className="text-slate-400 text-xs italic">David está digitando...</div>}
        <div ref={scrollRef} />
      </main>

      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}