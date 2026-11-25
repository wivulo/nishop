"use client";

import { Product } from '@prisma/client';
import { useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openDetail } from '@/lib/redux/Details/detailsSlice';
import ShopProductTile from '@/app/components/ShopProductTile';

type Props = { products: Product[] };
type Sort = 'featured' | 'lowest' | 'highest';

export default function Products({ products }: Props) {
  const [query] = useQueryState('product');
  const [category, setCategory] = useQueryState('category');
  const [sort, setSort] = useState<Sort>('featured');
  const dispatch = useDispatch();
  const categories = ['Todos', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  const filtered = useMemo(() => {
    const term = query?.trim().toLocaleLowerCase('pt') || '';
    const matching = products.filter((product) => {
      const matchesText = !term || [product.name, product.description, product.category].some((value) => value?.toLocaleLowerCase('pt').includes(term));
      return matchesText && (!category || product.category === category);
    });
    return [...matching].sort((a, b) => sort === 'lowest' ? a.price - b.price : sort === 'highest' ? b.price - a.price : Number(b.Emphasis) - Number(a.Emphasis));
  }, [products, query, category, sort]);

  return (
    <section className="shop-shell pb-24 pt-10 md:pt-16" aria-labelledby="catalog-title">
      <div className="rounded-[2rem] bg-[#f8eee4] px-7 py-11 sm:px-12 md:py-16">
        <span className="shop-eyebrow">Nishop · catálogo</span>
        <h1 id="catalog-title" className="mt-4 text-4xl font-bold tracking-tight text-main-regular md:text-5xl">Descobre a coleção.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-main-medium">Explora todos os produtos, encontra o que procuras e guarda espaço para uma surpresa.</p>
      </div>

      <div className="mb-7 mt-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-main-medium"><strong className="text-main-regular">{filtered.length}</strong> {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}{query ? ` para “${query}”` : ''}</p>
        <label className="flex items-center gap-3 text-sm font-medium text-main-medium">
          Ordenar por
          <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="rounded-full border border-[#e9ddd2] bg-white px-4 py-2.5 text-main-regular outline-none focus:border-main-primary">
            <option value="featured">Destaques</option>
            <option value="lowest">Menor preço</option>
            <option value="highest">Maior preço</option>
          </select>
        </label>
      </div>
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
        {categories.map((item) => {
          const selected = item === 'Todos' ? !category : category === item;
          return <button key={item} type="button" aria-pressed={selected} onClick={() => setCategory(item === 'Todos' ? null : item)} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${selected ? 'border-main-primary bg-main-primary text-white' : 'border-[#e9ddd2] bg-white text-main-medium hover:border-main-primary hover:text-main-primary'}`}>{item}</button>;
        })}
      </div>

      {filtered.length > 0 ? <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {filtered.map((product) => <ShopProductTile key={product.id} product={product} onOpen={(item) => dispatch(openDetail(item))} />)}
      </ul> : <div className="rounded-[1.5rem] border border-[#eee6de] bg-white px-8 py-16 text-center">
        <h2 className="text-xl font-semibold text-main-regular">Não encontramos produtos com esses filtros.</h2>
        <p className="mt-2 text-sm text-main-medium">Experimenta outra pesquisa ou escolhe uma categoria diferente.</p>
      </div>}
    </section>
  );
}
