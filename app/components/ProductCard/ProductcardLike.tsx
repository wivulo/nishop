import React from 'react';
import { SlHeart } from 'react-icons/sl';

const ProductCardLike: React.FC = () => {
    return (
        <button className='absolute w-8 h-8  right-2 top-2 z-50 rounded-full bg-base-background grid place-content-center border border-base-graybackground hover:bg-system-error transition-all hover:border-transparent group cursor-pointer'>
            <SlHeart className='group-hover:text-base-border' />
        </button>
    )
};

export default ProductCardLike;
