import Image, { ImageProps } from 'next/image';
import { twMerge } from 'tailwind-merge';

interface ProductCardImageProps extends ImageProps {
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({ ...props }) => {
    return (
        <div className='grid place-content-center relative w-auto h-auto'>
            <Image {...props} className={twMerge(`bg-contain`, props.className)} />
        </div>
    );
};

export default ProductCardImage;
