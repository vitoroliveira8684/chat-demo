import React from 'react';
import type { ProductItem } from '../data/catalog';
import { ProductCard } from './ProductCard';

interface CarouselProps {
  items: ProductItem[];
}

export const ProductCarousel: React.FC<CarouselProps> = ({ items }) => {
  return (
    <div className="flex overflow-x-auto gap-3 py-2 px-1 scrollbar-hide w-full">
      {items.map((item) => (
        <div key={item.id} className="min-w-55"> {/* Define largura fixa pra ficar lado a lado */}
          <ProductCard data={item} />
        </div>
      ))}
    </div>
  );
};