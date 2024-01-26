import anime from 'animejs';

const fadeIndAnimation = (element: any) => {
    anime({
        targets: element,
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic',
        elasticity: 250,
    });
}

const fadeOutAnimation = (element: any) => {
    anime({
        targets: element,
        opacity: [1, 0],
        duration: 800,
        easing: 'easeOutElastic',
        elasticity: 250,
    });
}

export const detailAnimations = {
    fadeIndAnimation,
    fadeOutAnimation
}