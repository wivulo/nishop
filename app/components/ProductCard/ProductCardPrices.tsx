import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProductCardPricesProps extends HTMLAttributes<HTMLDivElement>{
    price: number;
}

const ProductCardPrices: React.FC<ProductCardPricesProps> = ({ price, ...rest }) => {
    const formattedPrice = Number.isFinite(price) ? price.toLocaleString('pt-AO') : '—';

    return (
        <div {...rest} className={twMerge("", rest.className)}>
            <span className='text-sm font-semibold text-text-6'>Preço: {formattedPrice} Kz</span>
        </div>
    );
};

export default ProductCardPrices;
