import React from 'react';

interface CarouselHeaderProps {
    text: string;
}

const CarouselTitle: React.FC<CarouselHeaderProps> = ({ text }) => {
    return (
        <div>
            <p>{ text }</p>
        </div>
    );
};

export default CarouselTitle;
