import React from 'react';
import Image, {ImageProps} from 'next/image';

interface CarouselItemProps extends ImageProps {
    description?: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ src, alt, width, height, description}) => {
    return (
        <li className='w-36 h-auto border border-main-medium shadow-md shadow-black/50 rounded-md p-2 relative flex flex-col'>
            <figcaption className='flex flex-col gap-2'>
            <Image src={src} width={width} height={height} alt={alt}  className='rounded-md'/>
            <p className='text-text-6 text-sm flex self-start'>{description}</p>
            </figcaption>
        </li>
    );
};

export default CarouselItem;
