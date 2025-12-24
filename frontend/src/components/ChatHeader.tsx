interface ChatHeaderProps {
  title: string;
  subtitle: string;
  colorClass: string;
}

export const ChatHeader = ({ title, subtitle, colorClass }: ChatHeaderProps) => {
  return (
    // Usa a classe de cor que veio do App.tsx (bg-blue-600, bg-pink-500, etc)
    <header className={`w-full p-4 ${colorClass} text-white shadow-md flex items-center gap-3`}>
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
        {title.charAt(0)} {/* Pega a primeira letra do nome */}
      </div>
      <div>
        <h1 className="font-bold text-lg">{title}</h1>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <p className="text-xs opacity-90">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};