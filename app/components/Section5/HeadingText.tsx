"use client";
import { useQueryState } from 'nuqs';
import React from 'react';

type HeadingTextProps = {
    text: string;
};

const HeadingText: React.FC<HeadingTextProps> = ({ text }) => {
    const [productCategory, setProductCategory] = useQueryState("product-category");

    let computedText = text.split(" ")
    return (
        <p className={`text-center text-base ${productCategory == text ? "text-main-primary" :"text-text-2"}
            font-semibold group-hover:text-main-primary cursor-pointer flex flex-col justify-center`}>
                <span>{computedText[0]}</span>
                <span>{computedText[1]}</span>
        </p>
    );
};

export default HeadingText;
