import React from 'react';
import SliderSection from "../components/Slider";
import Section4 from '../components/Section4';
import Section3 from '../components/Section3';
import Section2 from '../components/section2';
import Section5 from '../components/Section5';
import { getProducts } from '@/app/(shop)/getProducts';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import ComponentsProductsWrapper from '../components/Section4and5Wrapper';

export default async function IndexPage() {

  return (
    <main className="w-full min-h-screen relative">
      <SliderSection />

      <Section2 />

      <Section3 />

      <ComponentsProductsWrapper />
    </main>
  )
}
