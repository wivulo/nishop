"use client";

import { Product } from '@prisma/client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { openDetail } from '@/lib/redux/Details/detailsSlice';
import ShopProductTile from '../ShopProductTile';
import { ProductListSkelton } from '../ProductListSkelton';
import { useState } from 'react';

type Props = { products?: Product[]; ispedding?: boolean };

export default function Section5({ products = [], ispedding }: Props) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState('Todos');
  const categories = ['Todos', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  const visible = category === 'Todos' ? products.slice(0, 8) : products.filter((product) => product.category === category).slice(0, 8);

  return (
    <section className="shop-shell pb-20 pt-12 md:pb-28" aria-labelledby="collection-heading">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="shop-eyebrow">A coleção</span>
          <h2 id="collection-heading" className="mt-3 text-3xl font-bold tracking-tight text-main-regular md:text-4xl">Encontra o teu próximo favorito.</h2>
        </div>
        <Link href="/products" className="text-sm font-semibold text-main-primary hover:underline">Explorar o catálogo completo</Link>
      </div>
      {!ispedding && categories.length > 1 && (
        <div className="mb-7 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${category === item ? 'border-main-primary bg-main-primary text-white' : 'border-[#e9ddd2] bg-white text-main-medium hover:border-main-primary hover:text-main-primary'}`}>
              {item}
            </button>
          ))}
        </div>
      )}
      {ispedding ? <ProductListSkelton /> : visible.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visible.map((product) => <ShopProductTile key={product.id} product={product} onOpen={(item) => dispatch(openDetail(item))} />)}
        </ul>
      ) : <p className="rounded-2xl bg-white p-8 text-main-medium">Ainda não há produtos nesta categoria.</p>}
    </section>
  );
}
