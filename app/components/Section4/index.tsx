"use client";

import React, { useReducer } from 'react';
import Wrapper from "@/app/components/Wrapper";
import { ProductCarousel } from "@/app/components/ProductCarousel";
import { Productcard } from "@/app/components/ProductCard";
import { carouselReducer } from "@/app/components/ProductCarousel/carouselReducer";
import { iProduct } from '@/app/models/iProduct';
import { useDispatch, useSelector } from 'react-redux';
import { decrease, increase } from '@/lib/redux/carousel/carouselSlice';
import { ReduxState } from '@/lib/redux';
import { Product } from '@prisma/client';
import { ProductListSkelton } from '../ProductListSkelton';
import { openDetail } from '@/lib/redux/Details/detailsSlice';

type Section4Type = {
  products: Array<Product>,
  ispedding?: boolean
}

const Section4: React.FC<Section4Type> = ({ products, ispedding }) => {
  //const [scrollLeft, dispatch] = useReducer(carouselReducer, 0);
  const dispatch = useDispatch()

  const handleMoveScrollRight = (value: number) => {
    dispatch(increase({ scroll: value }))
  }

  const handleMoveScrollLeft = (value: number) => {
    dispatch(decrease({ scroll: value }))
  }
  
      const handleOpenDetail = (product: Product) => {
          dispatch(openDetail(product));
      };

  return (
    <Wrapper className="my-12">
      <ProductCarousel.Root>
        <ProductCarousel.Heading>
          <ProductCarousel.Title text="Discover unique hand-picked items." />
        </ProductCarousel.Heading>
        <ProductCarousel.Items className="mx-5">
          {
            ispedding ?
            <ProductListSkelton />
            :
            products?.map((item: Product) => {
              if (item.Emphasis === false) {
                return (
                  <li key={item.id} className="last-of-type:mr-1 first-of-type:ml-2" onClick={() => handleOpenDetail(item)}>
                    <Productcard.Root>
                      <Productcard.Like />
                      <Productcard.Image src={item.imageSrc} width={500} height={500} alt={item.name} />
                      <Productcard.Description text={item.description} />
                      <Productcard.Price price={item.price} />
                    </Productcard.Root>
                  </li>
                )
              }
            })
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
