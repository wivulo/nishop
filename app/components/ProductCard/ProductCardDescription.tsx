import React from 'react';

interface ProductCardDescriptionProps {
    text: string;
}

const ProductCardDescription: React.FC<ProductCardDescriptionProps> = ({ text }) => {
    return (
        <div className='h-8'>
            <p className='text-text-2 text-xs'>{text}</p>
        </div>
    );
};

export default ProductCardDescription;
