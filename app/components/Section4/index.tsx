"use client";

import { Product } from '@prisma/client';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { openDetail } from '@/lib/redux/Details/detailsSlice';
import ShopProductTile from '../ShopProductTile';
import { ProductListSkelton } from '../ProductListSkelton';

type Props = { products?: Product[]; ispedding?: boolean };

export default function Section4({ products = [], ispedding }: Props) {
  const dispatch = useDispatch();
  const featured = products.filter((product) => product.Emphasis).slice(0, 4);
  const display = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <section className="shop-shell py-12 md:py-16" aria-labelledby="featured-heading">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="shop-eyebrow">Os destaques</span>
          <h2 id="featured-heading" className="mt-3 text-3xl font-bold tracking-tight text-main-regular md:text-4xl">Feitos para chamar atenção.</h2>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-main-primary transition-transform hover:translate-x-1">Ver todos <FaArrowRight aria-hidden="true" /></Link>
      </div>
      {ispedding ? <ProductListSkelton /> : display.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {display.map((product) => <ShopProductTile key={product.id} product={product} onOpen={(item) => dispatch(openDetail(item))} />)}
        </ul>
      ) : <p className="rounded-2xl bg-white p-8 text-main-medium">Novos produtos em breve.</p>}
    </section>
  );
}
