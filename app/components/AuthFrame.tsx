import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import Logo from './Logo';

type Props = { eyebrow: string; title: string; description: string; children: ReactNode; footer: ReactNode };

export default function AuthFrame({ eyebrow, title, description, children, footer }: Props) {
  return <main className="shop-shell grid min-h-screen w-full items-center gap-8 py-6 lg:grid-cols-2 lg:gap-16">
    <div className="flex h-full flex-col">
      <div className="py-4"><Logo /></div>
      <div className="mx-auto flex w-full max-w-[450px] flex-1 flex-col justify-center py-12">
        <span className="shop-eyebrow">{eyebrow}</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-main-regular md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-main-medium sm:text-base">{description}</p>
        <div className="mt-9">{children}</div>
        <div className="mt-8 text-sm text-main-medium">{footer}</div>
        <Link href="/" className="mt-8 w-fit text-sm font-semibold text-main-primary hover:underline">← Voltar à loja</Link>
      </div>
    </div>
    <div className="relative hidden min-h-[640px] overflow-hidden rounded-[2rem] bg-[#f8eee4] lg:flex lg:items-center lg:justify-center">
      <div className="absolute left-10 top-10 rounded-full bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[.16em] text-main-primary">Uma loja para descobrir</div>
      <Image src="/images/candiero.png" alt="Candeeiro da coleção Nishop" fill className="shop-hero-image object-contain p-20" sizes="50vw" />
      <div className="absolute bottom-10 left-10 right-10 rounded-2xl border border-white/70 bg-white/75 p-6 backdrop-blur-sm">
        <p className="text-xl font-semibold leading-snug text-main-regular">Descobre peças que tornam o quotidiano mais teu.</p>
      </div>
    </div>
  </main>;
}
