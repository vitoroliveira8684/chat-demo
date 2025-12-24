import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

// Define a estrutura de cada mensagem no chat
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant'; // Apenas estas duas opções são permitidas
}

// URL para ambiente de desenvolvimento (localhost)
const LOCAL_URL = 'http://localhost:3000/chat';

// FIXME: Defina PROD_URL aqui para seu servidor em produção
const PROD_URL = 'https://ai-api-rwnv.onrender.com/chat';

// Configuração de cada setor/negócio que pode usar o chat
// Cada setor tem nome, cor, mensagem de boas-vindas, etc.
const SECTORS_CONFIG: Record<string, { id: string; name: string; sub: string; color: string; welcome: string }> = {
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
  // sEstado das mensagens do chat
  const [messages, setMessages] = useState<Message[]>([]);
  // Indica se está aguardando resposta do backend
  const [loading, setLoading] = useState(false);
  // Armazena relatório técnico/resumo retornado pela IA
  const [report, setReport] = useState<string | null>(null); 
  
  // Referência para scroll automático até a última mensagem
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lê parâmetro 'setor' da URL (ex: ?setor=padaria)
  const params = new URLSearchParams(window.location.search);
  const sectorParam = params.get('setor') || 'contabil'; 
  // Obtém configuração do setor, ou usa 'contabil' como padrão
  const currentSector = SECTORS_CONFIG[sectorParam] || SECTORS_CONFIG['contabil'];

  // Inicializa chat com mensagem de boas-vindas do setor
  // Adicione 'currentSector.welcome' nas dependências para atualizar se o setor mudar
  useEffect(() => {
    setMessages([{
      id: '1',
      text: currentSector.welcome,
      sender: 'assistant',
    }]);
  }, [currentSector.welcome]);

  // Faz scroll automático quando novas mensagens chegam ou relatório é exibido
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, report]);

  // Envia mensagem para o backend e processa resposta
  const handleSendMessage = async (text: string) => {
    setLoading(true);
    setReport(null);
    
    // Adiciona mensagem do usuário ao chat imediatamente
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);

    // Seleciona URL conforme o ambiente (dev usa localhost, prod usa servidor remoto)
    // import.meta.env.DEV é true em desenvolvimento, false em produção
    const targetUrl = import.meta.env.DEV ? LOCAL_URL : PROD_URL;

    console.log("Enviando mensagem para:", targetUrl);

    try {
      // Faz requisição POST ao backend com a mensagem e histórico
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history: messages, // Contexto das mensagens anteriores
          type: currentSector.id // Identifica qual setor está usando
        }),
      });

      if (!response.ok) throw new Error('Erro backend');
      const data = await response.json();

      // Adiciona resposta do assistente ao chat
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: data.reply, sender: 'assistant' },
      ]);

      // Se houver relatório na resposta, exibe em destaque
      if (data.report) {
        setReport(data.report);
      }

    } catch (error) {
      console.error('Erro:', error);
      // Mostra mensagem de erro no chat se falhar
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Erro de conexão.', sender: 'assistant' },
      ]);
    } finally {
      setLoading(false); // Finaliza estado de carregamento
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 w-full">
      {/* Cabeçalho com nome e cor do setor */}
      <ChatHeader 
        title={currentSector.name} 
        subtitle={currentSector.sub} 
        colorClass={currentSector.color} 
      />

      {/* Área principal: lista de mensagens + relatório */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, i) => (
          <ChatMessage role={msg.sender} content={msg.text} key={i} />
        ))}
        
        {/* Exibe relatório técnico se disponível */}
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

        {/* Indicador de digitação enquanto aguarda resposta */}
        {loading && <div className="text-slate-400 text-xs italic">Digitando...</div>}
        
        {/* Referência para scroll automático */}
        <div ref={scrollRef} />
      </main>

      {/* Campo de input para o usuário escrever mensagens */}
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}