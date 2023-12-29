import React, { ReactNode } from 'react';

type HeadingItemProps = {
    children: ReactNode;
};

const HeadingItem: React.FC<HeadingItemProps> = ({ children }) => {
    return (
        <div className='w-auto h-auto'>
            <button className='w-[190px] h-20 grid place-content-center border-b border-base-border group'>
                {children}
            </button>
        </div>
    );
};

export default HeadingItem;
