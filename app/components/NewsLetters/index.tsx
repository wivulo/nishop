import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function NewsLetters() {
  return <section className="shop-shell pb-12" aria-labelledby="shop-cta-heading">
    <div className="relative overflow-hidden rounded-[2rem] bg-[#302820] px-7 py-12 text-white sm:px-12 md:py-16">
      <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
      <div className="absolute -bottom-36 right-28 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
      <div className="relative flex flex-wrap items-center justify-between gap-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[.2em] text-[#f2a56d]">Ainda há mais para descobrir</span>
          <h2 id="shop-cta-heading" className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">A próxima peça favorita pode estar à tua espera.</h2>
        </div>
        <Link href="/products" className="shop-button bg-white text-main-regular hover:bg-[#fff0e5]">Explorar catálogo <FaArrowRight aria-hidden="true" /></Link>
      </div>
    </div>
  </section>;
}
