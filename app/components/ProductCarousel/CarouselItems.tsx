"use client";

import { ReduxState } from '@/lib/redux';
import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

interface iCarouselItemsProps extends React.HTMLAttributes<HTMLUListElement> {
    children: React.ReactNode;
}

const CarouselItems: React.FC<iCarouselItemsProps> = ({ children,...rest }) => {
    const listRef = useRef<HTMLUListElement>(null);
    const { scrollleft } = useSelector((state: ReduxState) => state.carousel)

    useEffect(() => {
        if (listRef.current) {
            const targetScroll = listRef.current.scrollLeft + scrollleft;
            const animation = anime({
                targets: { value: listRef.current.scrollLeft },
                value: targetScroll,
                round: 1,
                easing: "easeOutElastic",
                duration: 50,
                delay: 0,
                update: function(anim) {
                    listRef.current && (listRef.current.scrollLeft = Number(anim.animations[0].currentValue));
                }
            });
        }
    }, [scrollleft]);

    return (
        <div className='w-[1333px] h-full px-3 flex justify-center scroll-smooth'>
            <ul ref={listRef} {...rest} className={twMerge('flex w-auto gap-x-4 overflow-x-hidden py-2 scroll-smooth', rest.className)}>
                    {children}
            </ul>
        </div>
    );
};

export default CarouselItems;