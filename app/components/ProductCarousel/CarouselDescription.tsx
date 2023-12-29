import React from 'react';

interface iCarouselDescriptionProps {
    text: string;
}

const CarouselDescription: React.FC<iCarouselDescriptionProps> = ({ text }) => {
    return (
        <div>
            <span className='text-xs text-SubText'>{ text }</span>
        </div>
    );
};

export default CarouselDescription;
