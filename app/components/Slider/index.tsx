import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function SliderSection() {
  return (
    <section className="shop-shell pt-8 md:pt-12" aria-labelledby="home-hero-title">
      <div className="shop-hero relative overflow-hidden rounded-[2rem] bg-[#f8eee4]">
        <div className="relative z-10 flex min-h-[520px] flex-col justify-center px-7 py-14 sm:px-12 lg:w-[56%] lg:px-16">
          <span className="shop-eyebrow">Nishop · escolhas com personalidade</span>
          <h1 id="home-hero-title" className="mt-6 max-w-[640px] text-[clamp(2.7rem,5.3vw,5.7rem)] font-bold leading-[1.06] tracking-[-0.055em] text-main-regular">
            Encontra o detalhe que transforma tudo.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-main-medium sm:text-lg">
            Peças para a casa, presentes e ideias para o dia a dia. Descobre a coleção e escolhe ao teu ritmo.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link href="/products" className="shop-button shop-button-primary">
              Explorar produtos <FaArrowRight aria-hidden="true" className="text-sm" />
            </Link>
            <span className="text-sm font-medium text-main-medium">Uma seleção feita para surpreender.</span>
          </div>
        </div>
        <div className="relative min-h-[360px] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[48%]">
          <div className="absolute inset-8 rounded-[45%] bg-white/40 blur-3xl" aria-hidden="true" />
          <Image src="/images/candiero.png" alt="Candeeiro de pé da coleção Nishop" fill priority className="shop-hero-image object-contain p-8 lg:p-12" sizes="(max-width: 1024px) 100vw, 48vw" />
        </div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-white/50" aria-hidden="true" />
      </div>
    </section>
  );
}
