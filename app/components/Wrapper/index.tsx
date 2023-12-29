import React from 'react';
import { twMerge } from 'tailwind-merge';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children, ...rest }) => {
    return (
        <section {...rest} className={twMerge(`relative w-full h-auto`, rest.className)}>
            {children}
        </section>
    );
};

export default Wrapper;
