import React from 'react';
import SliderSection from "../components/Slider";
import Section4 from '../components/Section4';
import Section3 from '../components/Section3';
import Section2 from '../components/section2';
import Section5 from '../components/Section5';
import { getProducts } from '@/app/(shop)/getProducts';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export default async function IndexPage() {

  let products: Product[] = await getProducts();

  return (
    <main className="w-full min-h-screen relative">
      <SliderSection />

      <Section2 />

      <Section3 />

      <Section4 products={products} />

      <Section5 products={products} />
    </main>
  )
}
