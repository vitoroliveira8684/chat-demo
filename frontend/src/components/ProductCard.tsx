import React from 'react';

type ProductData = {
  name: string;
  price: string;
  image: string | string[];
  link: string;
};

export const ProductCard: React.FC<{ data: ProductData }> = ({ data }) => {
  const image = Array.isArray(data.image) ? data.image[0] : data.image;
  return (
    <article>
      {image && <img src={image} alt={data.name} />}
      {/* ...existing code... */}
    </article>
  );
};