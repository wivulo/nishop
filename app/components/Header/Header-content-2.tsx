"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Início' },
  { href: '/products', label: 'Todos os produtos' },
];

export default function HeaderContent2() {
  const pathname = usePathname();
  return <nav aria-label="Navegação principal" className="flex items-center gap-2 overflow-x-auto py-2">
    {links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${pathname === href ? 'bg-[#fff0e5] text-main-primary' : 'text-main-medium hover:bg-white hover:text-main-primary'}`}>{label}</Link>)}
  </nav>;
}
