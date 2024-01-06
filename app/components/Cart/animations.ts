export const showCartAnimation = (anime: any, el: any) => {
    const cart = el;

    cart && anime({
        targets: cart,
        duration: 200,
        translateX: ["100%", "0"],
        easing: "easeOutElastic"
    })
}

export const hideCartAnimation = (anime: any, el: any) => {
    const cart = el;

    cart && anime({
        targets: cart,
        duration: 200,
        translateX: ["0", "100%"],
        easing: "easeInElastic"
    })
}