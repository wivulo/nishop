import React, { ReactNode } from 'react';

interface CarouselHeadingProps {
    children?: ReactNode;
}

const CarouselHeading: React.FC<CarouselHeadingProps> = ({ children }) => {
    return (
        <div className='pl-10'>
            {children}
        </div>
    );
};

export default CarouselHeading;
