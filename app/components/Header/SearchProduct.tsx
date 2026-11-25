"use client";

import { FormEvent, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { FaSearch } from 'react-icons/fa';

export default function SearchProduct() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useQueryState('product');
  const [value, setValue] = useState(query || '');

  useEffect(() => { setValue(query || ''); }, [query]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = value.trim();
    if (pathname === '/products') void setQuery(term || null);
    else router.push(term ? `/products?product=${encodeURIComponent(term)}` : '/products');
  };

  return <form onSubmit={submit} role="search" className="flex min-w-0 flex-1 items-center rounded-full border border-[#e9ddd2] bg-white px-4 py-2.5 transition-colors focus-within:border-main-primary">
    <input aria-label="Pesquisar produtos" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Pesquisar produtos" className="w-full min-w-0 bg-transparent text-sm text-main-regular outline-none placeholder:text-main-medium" />
    <button type="submit" aria-label="Pesquisar" className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-main-primary transition-colors hover:bg-[#fff0e5]"><FaSearch aria-hidden="true" /></button>
  </form>;
}
