import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [text, setText] = useState('');

  // LOGIC: Centraliza o envio. Se o texto for vazio (só espaços), bloqueia.
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText(''); // Limpa o input imediatamente após enviar
    }
  };

  // LOGIC: Gerencia o aperto de teclas.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita comportamentos padrão de formulário se houver
      handleSend();
    }
  };

  return (
    // VISUAL: 'fixed bottom-0' prende a barra no rodapé. 
    // 'bg-white/80 backdrop-blur' dá aquele efeito "vidro" moderno do iOS/Windows.
    <footer className="fixed bottom-0 left-0 w-full p-2 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg z-10">
      
      {/* Container centralizado para alinhar com o chat */}
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        
        {/* TODO (Melhoria Futura): Substituir <input> por <textarea> que cresce automaticamente (auto-resize).
           Isso permite que o usuário escreva textos longos com quebra de linha (Shift+Enter).
        */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua dúvida..."
          disabled={disabled}
          // VISUAL: Input arredondado e limpo, sem bordas pesadas
          className="border border-slate-400 flex-1 p-3 pl-5 bg-slate-100 text-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
        />

        {/* TODO (Melhoria Futura): Adicionar botão de anexo (clipe de papel) aqui para envio de PDF/Imagens.
        */}

        <button 
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          // VISUAL: Botão circular com ícone, estilo WhatsApp
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Enviar mensagem"
        >
          {/* Ícone de avião de papel (SVG Inline para não precisar de bibliotecas extras agora) */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
      
      {/* TODO (Melhoria Futura): Adicionar um texto pequeno aqui embaixo tipo "IA pode cometer erros", 
         para compliance e aviso legal.
      */}
    </footer>
  );
};