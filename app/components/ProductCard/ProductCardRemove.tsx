import React, { HTMLAttributes } from 'react';
import { FaTimes } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

const ProductCardRemove: React.FC<HTMLAttributes<HTMLButtonElement>> = ({...rest}) => {
    return (
        <button {...rest} className={twMerge('absolute w-8 h-8  right-2 top-2 z-50 rounded-full bg-base-background grid place-content-center border border-base-graybackground transition-all hover:border-transparent group cursor-pointer', rest.className)}>
            <FaTimes className='group-hover:text-system-error' />
        </button>
    )
};

export default ProductCardRemove;
