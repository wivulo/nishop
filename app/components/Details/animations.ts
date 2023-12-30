import anime from 'animejs';

const expandAnimation = (element: any, isOpen: boolean) => {
    const expandAnimation = anime({
        targets: element,
        width: ["0", "100%"],
        scaleX: [0, 1],
        scaleY: [0, 1],
        duration: 800,
        easing: 'easeOutElastic',
        elasticity: 250,
    });

    /*
        anime({
            targets: detail,
            width: ["0", "100%"],
            duration: 800,
            easing: 'easeOutElastic',
            elasticity: 250,
            scale: [0, 1],
            display: isOpen ? 'grid' : 'none',
        })

        anime({
            targets: detail,
            width: ["100%", "0"],
            duration: 250,
            easing: 'easeOutSine',
            elasticity: 250,
            scale: [0, 1],
            display: isOpen ? 'grid' : 'none',
        })
    */
}

const translateAnimation = (element: any, parentVisible: boolean) => {
    const translateAnimation = anime({
        targets: element,
        translateX: parentVisible ? '100%' : '0',
        duration: 500,
        easing: 'easeOutElastic',
        autoplay: false
    });
}

export const detailAnimations = {
    expandAnimation,
    translateAnimation,
}