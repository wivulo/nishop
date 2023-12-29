"use client";

import React, { useEffect, useRef } from 'react';
import "../../styles/Slider/base.css";
import "../../styles/Slider/demo.css";
import { Slider } from './demo';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { FaDotCircle } from 'react-icons/fa';
import SliderControl from './SliderControl';
import { Button } from '../Button';
import SliderListItem from './SliderListItem';
import Wrapper from '../Wrapper';

interface iSliderProps {
    // Define your component's props here
}

const SliderSection: React.FC<iSliderProps> = ({ }: iSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    let _slider: any

    useEffect(() => {
        _slider = new Slider({
            element: sliderRef.current && sliderRef.current,
        });
    }, []);

    return (
        <Wrapper>
            <div className='absolute left-0 -top-10 w-full h-[400px] bg-base-graybackground z-10'></div>
            <div className="page-wrapper z-20 my-10" id="wannabedev">

                <div ref={sliderRef} className="slider flex justify-center">

                    <ul className="slider-list">

                        <SliderListItem
                            product='apple'
                            description='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo ratione nisi perferendis? Nemo in accusamus cupiditate officiis.'
                            link='#'
                            img='assets/img/back_apple_002.png'
                            alt='apple'
                        />

                        <SliderListItem
                            product='grapes'
                            description='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo ratione nisi perferendis? Nemo in accusamus cupiditate officiis.'
                            link='#'
                            img='assets/img/grapes.png'
                            alt='grapes'
                        />

                        <SliderListItem
                            product='strawberry'
                            description='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo ratione nisi perferendis? Nemo in accusamus cupiditate officiis.'
                            link='#'
                            img='assets/img/back_apple_002.png'
                            alt='strawberry'
                        />
                    </ul>

                    <div className="slider__nav-bar flex justify-center self-end mb-3">
                        <a className="nav-control text-white"> <FaDotCircle /> </a>
                        <a className="nav-control text-white"> <FaDotCircle /></a>
                        <a className="nav-control text-white"> <FaDotCircle /></a>
                    </div>

                    <div className="slider__controls">
                        <SliderControl dirx={0} icon={SlArrowLeft} action={() => _slider?.goPrev()} />
                        <SliderControl dirx={1} icon={SlArrowRight} action={() => _slider?.goNext()} />
                    </div>

                </div>

            </div>
        </Wrapper>
    );
};

export default SliderSection;
