import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import data from '@/app/data/data.json';

export default function Section3() {
  return (
    <section className="shop-shell py-12 md:py-16" aria-labelledby="discover-heading">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="shop-eyebrow">Inspiração para começar</span>
          <h2 id="discover-heading" className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight text-main-regular md:text-4xl">Ideias para cada momento.</h2>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-main-primary transition-transform hover:translate-x-1">Ver toda a coleção <FaArrowRight aria-hidden="true" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.wathYouGetHere.slice(0, 4).map((item) => (
          <Link key={item.id} href="/products" className="group overflow-hidden rounded-[1.4rem] border border-[#eee6de] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[#f7f2ed]">
              <Image src={item.imageSrc} alt={item.description} fill className="object-contain p-7 transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-4">
              <span className="text-sm font-semibold text-main-regular sm:text-base">{item.description}</span>
              <FaArrowRight aria-hidden="true" className="shrink-0 text-main-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
