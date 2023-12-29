"use client";

import React from 'react';

interface iCarouselRootProps {
    children: React.ReactNode;
}

const CarouselRoot: React.FC<iCarouselRootProps> = ({ children }) => {

    return (
        <div className='h-auto w-full px-2 flex flex-col relative gap-y-3'>
            { children }
        </div>
    );
};

export default CarouselRoot;
