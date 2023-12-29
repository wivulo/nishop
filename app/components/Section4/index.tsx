"use client";

import React, { useReducer } from 'react';
import Wrapper from "@/app/components/Wrapper";
import { ProductCarousel } from "@/app/components/ProductCarousel";
import { Productcard } from "@/app/components/ProductCard";
import { carouselReducer } from "@/app/components/ProductCarousel/carouselReducer";
import { iProduct } from '@/app/models/iProduct';

type Section4Type = {
  products: Array<iProduct>
}

const Section4: React.FC<Section4Type> = ({ products }) => {
  const [scrollLeft, dispatch] = useReducer(carouselReducer, 0);

  const handleMoveScrollRight = (value: number) => {
    dispatch({
      type: "type/increase",
      payload: {
        scroll: value
      }
    })
  }

  const handleMoveScrollLeft = (value: number) => {
    dispatch({
      type: "type/decrease",
      payload: {
        scroll: value
      }
    })
  }

  return (
    <Wrapper className="my-12">
      <ProductCarousel.Root>
        <ProductCarousel.Heading>
          <ProductCarousel.Title text="Discover unique hand-picked items." />
        </ProductCarousel.Heading>
        <ProductCarousel.Items className="mx-5" scrollLeft={scrollLeft}>
          {products.map((item: iProduct) => {
            if (item.Emphasis === false) {
              return (
                <li key={item.id} className="last-of-type:mr-1 first-of-type:ml-2">
                  <Productcard.Root>
                    <Productcard.Image src={item.imageSrc} width={500} height={500} alt={item.name} />
                    <Productcard.Description text={item.description} />
                    <Productcard.Price price={item.price} />
                  </Productcard.Root>
                </li>
              )
            }
          }
          )
          }
        </ProductCarousel.Items>
        <ProductCarousel.Controls
          onMoveScrollRight={() => handleMoveScrollRight(200)}
          onMoveScrollLeft={() => handleMoveScrollLeft(200)} />
      </ProductCarousel.Root>
    </Wrapper>
  );
}
export default Section4;
