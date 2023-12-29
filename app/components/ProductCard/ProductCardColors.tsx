import React from 'react';

interface ProductCardColorsProps {
    children?: React.ReactNode;
}

const ProductCardColors: React.FC<ProductCardColorsProps> = ({ children }) => {
    return (
        <div className='flex flex-col gap-3'>
            <p className='text-xs text-text-6 font-semibold'>Colors:</p>
            <div className='flex gap-1'>{children}</div>
        </div>
    );
};

export default ProductCardColors;
