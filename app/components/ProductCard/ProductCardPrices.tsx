import React from 'react';

interface ProductCardPricesProps {
    price: number;
}

const ProductCardPrices: React.FC<ProductCardPricesProps> = ({ price }) => {
    return (
        <div>
            <span className='text-sm font-semibold text-text-6'>Price: ${price}</span>
        </div>
    );
};

export default ProductCardPrices;
