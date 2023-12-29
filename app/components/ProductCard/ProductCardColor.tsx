import React from 'react';

interface ProductCardColorProps {
    color: string;
}

const ProductCardColor: React.FC<ProductCardColorProps> = ({ color }) => {
    return <div className={`rounded-full w-4 h-4 bg-[${color}]`}></div>
};

export default ProductCardColor;
