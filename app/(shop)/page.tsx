import SliderSection from "../components/Slider";
import Section3 from '../components/Section3';
import Section2 from '../components/section2';
import ComponentsProductsWrapper from '../components/Section4and5Wrapper';

export default function IndexPage() {
  return (
    <main className="relative min-h-screen w-full">
      <SliderSection />
      <Section2 />
      <Section3 />
      <ComponentsProductsWrapper />
    </main>
  )
}
