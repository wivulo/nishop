import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProductCardDescriptionProps extends HTMLAttributes<HTMLDivElement> {
    text: string;
}

const ProductCardDescription: React.FC<ProductCardDescriptionProps> = ({ text, ...rest }) => {
    return (
        <div {...rest} className={twMerge(`h-8`, rest.className)}>
            <p className='text-text-2 text-xs'>{text}</p>
        </div>
    );
};

export default ProductCardDescription;
