"use client";

import { Product } from '@prisma/client';
import { FaArrowRight } from 'react-icons/fa';

type Props = {
  product: Product;
  onOpen: (product: Product) => void;
};

export default function ShopProductTile({ product, onOpen }: Props) {
  const price = Number.isFinite(product.price) ? product.price.toLocaleString('pt-AO') : '—';

  return (
    <li className="min-w-0">
      <button type="button" onClick={() => onOpen(product)} className="shop-product-card group flex h-full w-full flex-col overflow-hidden rounded-[1.4rem] border border-[#eee6de] bg-white p-3 text-left">
        <span className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[1rem] bg-[#f7f2ed]">
          {product.imageSrc ? <img src={product.imageSrc} alt={product.name} loading="lazy" className="h-full w-full object-contain p-5" /> : <span className="text-sm text-main-medium">Imagem indisponível</span>}
        </span>
        <span className="flex flex-1 flex-col px-2 pb-2 pt-4">
          <span className="text-[.7rem] font-semibold uppercase tracking-[.14em] text-main-primary">{product.category || 'Nishop'}</span>
          <span className="mt-2 line-clamp-2 min-h-[3rem] text-sm font-semibold leading-6 text-main-regular sm:text-base">{product.description || product.name}</span>
          <span className="mt-4 flex items-center justify-between gap-2 border-t border-[#f0e9e2] pt-4">
            <span className="text-base font-bold text-main-regular">{price} Kz</span>
            <FaArrowRight aria-hidden="true" className="text-main-primary transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </button>
    </li>
  );
}
