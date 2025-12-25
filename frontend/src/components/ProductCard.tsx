import React from 'react';
import type { ProductItem } from '../data/catalog';

interface ProductProps {
  data: ProductItem;
}

export const ProductCard: React.FC<ProductProps> = ({ data }) => {
  // Tratamento de segurança: Se a imagem for uma lista, pega a primeira. Se for string, usa ela.
  const imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full w-64 hover:shadow-lg transition-shadow duration-300">
      
      {/* ÁREA DA IMAGEM (Com tamanho travado) */}
      <div className="h-48 w-full bg-white p-4 flex items-center justify-center border-b border-slate-100 relative">
        <img 
          src={imageUrl} 
          alt={data.name} 
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300" 
        />
        {/* Selo de Preço flutuante (Opcional, fica bonito) */}
        <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
          Ofertão
        </div>
      </div>

      {/* ÁREA DE TEXTO */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 mb-2" title={data.name}>
            {data.name}
          </h3>
          <p className="text-blue-600 font-bold text-lg">
            {data.price}
          </p>
          <p className="text-slate-400 text-xs mb-3">
            Em até 12x no cartão
          </p>
        </div>

        <a 
          href={data.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm active:transform active:scale-95"
        >
          Ver Detalhes 🛒
        </a>
      </div>
    </div>
  );
};