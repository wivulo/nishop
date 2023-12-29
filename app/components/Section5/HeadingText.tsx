import React from 'react';

type HeadingTextProps = {
    text: string;
};

const HeadingText: React.FC<HeadingTextProps> = ({ text }) => {
    return <p className='text-center text-base text-text-2 font-semibold group-hover:text-main-primary cursor-pointer'>{text}</p>;
};

export default HeadingText;
