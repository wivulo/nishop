import { openDetail } from '@/lib/redux/Details/detailsSlice';
import React, { ReactNode } from 'react';
import { SlHeart } from 'react-icons/sl';
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';

interface iProductCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const ProductCardRoot: React.FC<iProductCardRootProps> = ({ children,...rest }) => {
    
    return (
        <div {...rest} className={twMerge(`p-2 shadow shadow-black bg-main-white w-52 h-72 flex
        flex-col gap-4 relative cursor-pointer`, rest.className)}>
            {children}
        </div>
    );
};

export default ProductCardRoot;
