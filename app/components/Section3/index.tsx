"use client";

import React, { useReducer } from 'react';
import Wrapper from "@/app/components/Wrapper";
import { ProductCarousel } from "@/app/components/ProductCarousel";
import data from "@/app/data/data.json";
import { carouselReducer } from "@/app/components/ProductCarousel/carouselReducer";
import { iWhathYouFind } from '@/app/models/iWhatYouFind';

const Section3: React.FC = () => {
  const [scrollLeft, dispatch] = useReducer(carouselReducer, 0);

  const handleMoveScroll = (value: number) => {
    dispatch({
      type: "type/increase",
      payload: {
        scroll: value
      }
    })
  }

  return (
    <Wrapper className="my-7" id="carousel">
      <ProductCarousel.Root>
        <ProductCarousel.Heading>
          <ProductCarousel.Title text="Find things you'll love. Support independent sellers." />
          <ProductCarousel.Description text="Only on polka." />
        </ProductCarousel.Heading>
        <ProductCarousel.Items scrollLeft={scrollLeft}>
          {data.wathYouGetHere.map((item: iWhathYouFind) =>
            <ProductCarousel.Item
              key={item.id}
              src={item.imageSrc}
              width={400}
              height={400}
              alt={item.name}
              description={item.description}
            />
          )
          }
        </ProductCarousel.Items>
        <ProductCarousel.Controls onMoveScrollRight={() => handleMoveScroll(2)} />
      </ProductCarousel.Root>
    </Wrapper>
  );
}
export default Section3;
