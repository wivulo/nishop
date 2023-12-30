"use client";

import React from 'react';
import Wrapper from "@/app/components/Wrapper";
import { ProductCarousel } from "@/app/components/ProductCarousel";
import data from "@/app/data/data.json";
import { iWhathYouFind } from '@/app/models/iWhatYouFind';
import { useDispatch, useSelector } from 'react-redux';
import { decrease, increase } from '@/lib/redux/carousel/carouselSlice';

const Section3: React.FC = () => {
  const dispatch = useDispatch()

  const handleMoveScrollRight = (value: number) => {
    dispatch(increase({scroll: value}))
  }

  const handleMoveScrollLeft = (value: number) => {
    dispatch(decrease({scroll: value}))
  }
  return (
    <Wrapper className="my-7" id="carousel">
      <ProductCarousel.Root>
        <ProductCarousel.Heading>
          <ProductCarousel.Title text="Find things you'll love. Support independent sellers." />
          <ProductCarousel.Description text="Only on polka." />
        </ProductCarousel.Heading>
        <ProductCarousel.Items>
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
        <ProductCarousel.Controls 
        onMoveScrollRight={() => handleMoveScrollRight(200)}
        onMoveScrollLeft={() => handleMoveScrollLeft(200)} 
        />
      </ProductCarousel.Root>
    </Wrapper>
  );
}
export default Section3;
