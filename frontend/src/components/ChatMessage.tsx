interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
        isUser 
        ? 'bg-blue-600 text-white rounded-tr-none' 
        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
      }`}>
        {content}
      </div>
    </div>
  );
};