"use client"

import React, { useReducer } from 'react';
import { Button } from '../Button';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { carouselReducer } from './carouselReducer';

interface iCarouselControlsProps {
    // Define the props for your component here
    onMoveScrollRight: () => void
    onMoveScrollLeft: () => void
}

const CarouselControls: React.FC<iCarouselControlsProps> = ({ onMoveScrollRight, onMoveScrollLeft }) => {


    return (
        <div className='absolute flex justify-between left-0  w-full h-10 my-32 px-1'>
            <Button.Root hasbg className='bg-main-medium w-8 h-8 hover:bg-main-medium/25'
                onClick={onMoveScrollLeft}>
                <Button.Icon icon={SlArrowLeft} className='text-white text-sm'/>
            </Button.Root>

            <Button.Root  hasbg className='bg-main-medium w-8 h-8 hover:bg-main-medium/25'
                onClick={onMoveScrollRight}>
                <Button.Icon icon={SlArrowRight} className='text-white text-sm'/>
            </Button.Root>
        </div>
    );
};

export default CarouselControls;
