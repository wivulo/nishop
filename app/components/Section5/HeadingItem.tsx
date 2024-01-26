import React, { HTMLAttributes, ReactNode } from 'react';

interface iHeadingItemProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
};

const HeadingItem: React.FC<iHeadingItemProps> = ({ children, ...rest }) => {
    return (
        <div className='w-auto h-auto' {...rest}>
            <button className='w-[190px] h-20 grid place-content-center border-b border-base-border group'>
                {children}
            </button>
        </div>
    );
};

export default HeadingItem;
