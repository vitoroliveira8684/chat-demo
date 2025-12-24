import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

// 1. CONFIGURAÇÃO DOS SETORES
const SECTORS_CONFIG: any = {
  contabil: {
    id: 'contabil',
    name: 'David Contabilidade',
    sub: 'Assistente Virtual',
    color: 'bg-blue-600',
    welcome: 'Olá! Sou o David, seu assistente de contabilidade. Precisa de ajuda com MEI ou IR?'
  },
  padaria: {
    id: 'padaria',
    name: '🥖 Padaria Doce Sabor',
    sub: 'Pedidos e Encomendas',
    color: 'bg-pink-500', 
    welcome: 'Oiii! 🍰 Bem-vindo à Doce Sabor! O sonho acabou de sair. Vai querer?'
  },
  restaurante: {
    id: 'restaurante',
    name: '🍝 Bella Italia',
    sub: 'Reservas e Menu',
    color: 'bg-green-700',
    welcome: 'Buonasera! Bem-vindo ao Bella Italia. Gostaria de fazer uma reserva?'
  }
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // NOVO: Estado para guardar o relatório quando ele chegar
  const [report, setReport] = useState<string | null>(null); 
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(window.location.search);
  const sectorParam = params.get('setor') || 'contabil'; 
  const currentSector = SECTORS_CONFIG[sectorParam] || SECTORS_CONFIG['contabil'];

  useEffect(() => {
    setMessages([{
      id: '1',
      text: currentSector.welcome,
      sender: 'assistant',
    }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, report]); // Adicionei 'report' aqui para rolar a tela quando o resumo aparecer

  const handleSendMessage = async (text: string) => {
    setLoading(true);
    setReport(null); // Limpa o relatório anterior se o usuário continuar falando
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history: messages,
          type: currentSector.id
        }),
      });

      if (!response.ok) throw new Error('Erro backend');
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: data.reply, sender: 'assistant' },
      ]);

      // --- AQUI ESTÁ A MÁGICA ---
      // Se o backend mandou um "report", a gente salva ele no estado
      if (data.report) {
        setReport(data.report);
      }
      // --------------------------

    } catch (error) {
      console.error('Erro:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Erro de conexão.', sender: 'assistant' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 w-full">
      <ChatHeader 
        title={currentSector.name} 
        subtitle={currentSector.sub} 
        colorClass={currentSector.color} 
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, i) => (
          <ChatMessage role={msg.sender} content={msg.text} key={i} />
        ))}
        
        {/* --- EXIBIÇÃO DO RELATÓRIO (SÓ APARECE SE TIVER DADOS) --- */}
        {report && (
          <div className="mx-4 mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 mb-2 border-b border-yellow-200 pb-2">
              <span className="text-xl">📋</span>
              <h3 className="font-bold text-yellow-800 text-sm uppercase">Resumo Técnico (CRM)</h3>
            </div>
            <pre className="text-sm text-yellow-900 font-mono whitespace-pre-wrap leading-relaxed">
              {report}
            </pre>
            <p className="text-[10px] text-yellow-600 mt-3 text-right italic">
              *Dados extraídos automaticamente pela IA
            </p>
          </div>
        )}
        {/* -------------------------------------------------------- */}

        {loading && <div className="text-slate-400 text-xs italic">Digitando...</div>}
        <div ref={scrollRef} />
      </main>

      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}