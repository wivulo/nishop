import React from 'react';
import { Button } from '../Button';

interface SliderListItemProps {
    product: string;
    description: string;
    link: string;
    img: string;
    alt: string;
}

const SliderListItem: React.FC<SliderListItemProps> = ({ product, description, img, alt }) => (
    <>
        <li className={`slider-list__item`}>
            <span className="back__element">
                {/* <img src="assets/img/back_apple_002.png" /> */}
            </span>
            <span className="main__element">
                {/* <img src="assets/img/bottle_apple_002.png" /> */}
            </span>
            <span className="front__element">
                {/* <img src="assets/img/front_apple_002.png" alt={alt} /> */}
            </span>
            <span className="title__element opacity-10">
                <span className="title">{product}</span>
            </span>
            <span className="more__element">
                <span className="content">
                    <span className="headline text-base-soft">{product}</span>
                    <span className="excerpt text-base-soft/60">{description}</span>
                    <Button.Root className="link p-0 justify-start">
                        <Button.Text text="Open catalog"
                            className='text-main-white relative -left-10 hover:text-main-primary' />
                    </Button.Root>
                </span>
            </span>
        </li>
    </>
);

export default SliderListItem;
