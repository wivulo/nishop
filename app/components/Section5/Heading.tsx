import React from 'react';

type HeadingProps = {
    children: React.ReactNode;
};

const Heading: React.FC<HeadingProps> = ({ children }) => {
    return <div className='flex gap-6'>{children}</div>;
};

export default Heading;
