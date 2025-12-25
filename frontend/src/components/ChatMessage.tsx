import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CATALOG } from '../data/catalog';
import { ProductCarousel } from './ProductCarousel';
// O import do ProductCard foi removido pois não estava sendo utilizado

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';

  // Lógica de Extração de Tags
  const listMatch = content.match(/\[VER_LISTA: (\w+)\]/);
  const listId = listMatch ? listMatch[1] : null;
  const productsList = listId ? CATALOG[listId] : null;

  const productMatch = content.match(/\[VER_PRODUTO: (\w+)\]/);
  const productId = productMatch ? productMatch[1] : null;
  const singleProduct = productId ? CATALOG[productId] : null;

  // Remove as tags técnicas do texto visual
  const cleanText = content
    .replace(/\[VER_LISTA: \w+\]/, '')
    .replace(/\[VER_PRODUTO: \w+\]/, '')
    .trim();

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6 w-full`}>
      
      {/* BALÃO DE TEXTO */}
      {cleanText && (
        <div
          className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
          }`}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Removemos 'node' da desestruturação para corrigir o erro de lint
              ul: ({...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
              ol: ({...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
              li: ({...props}) => <li className="pl-1" {...props} />,
              p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
              strong: ({...props}) => <span className="font-bold text-indigo-600" {...props} />,
              a: ({...props}) => <a className="text-blue-500 underline hover:text-blue-700" {...props} />,
            }}
          >
            {cleanText}
          </ReactMarkdown>
        </div>
      )}

      {/* CARROSSEL DE LISTA */}
      {productsList && (
        <div className="w-full mt-3 animate-fade-in">
           <p className="text-xs text-slate-500 ml-2 mb-2 font-medium uppercase tracking-wider flex items-center gap-1">
             ✨ Destaques da Loja
           </p>
           <ProductCarousel items={productsList} />
        </div>
      )}
      
      {/* CARROSSEL DE PRODUTO ÚNICO */}
      {singleProduct && Array.isArray(singleProduct) && (
         <div className="w-full mt-2 animate-fade-in pl-2">
           <ProductCarousel items={singleProduct} />
        </div>
      )}
    </div>
  );
};