import React, { useReducer } from 'react';
import Image from "next/image";
import SliderSection from "./components/Slider";
import Section4 from './components/Section4';
import Section3 from './components/Section3';
import Section2 from './components/section2';
import data from "@/app/data/data.json";
import Section5 from './components/Section5';

export default function IndexPage() {
  return (
    <main className="w-full min-h-screen">
      <SliderSection />

      <Section2 />

      <Section3 />

      <Section4 products={data.products} />

      <Section5 products={data.products}/>
    </main>
  )
}
