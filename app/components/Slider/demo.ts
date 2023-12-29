/**
 * demo.js
 *
 * Licensed under the MIT license.
 * https://opensource.org/license/mit/
 * 
 * Copyright 2023, WANNABEDEV
 * https://wannabedev.io
 */

import anime from "animejs";

interface iSliderProps {
    element: React.ElementRef<any>;
}

export class Slider {
    rootElement: any;
    slides: any;
    slidesLength: any;
    current: any;
    isAnimating: any;
    direction: any;
    baseAnimeSettings: any;
    baseAnimeSettingsBack: any;
    baseAnimeSettingsFront: any;
    baseAnimeSettingsTitle: any;
    navBar: any;
    thumbs: any;
    prevButton: any;
    nextButton: any;
    [key: string]: any;


    constructor(props: iSliderProps) {
        this.rootElement = props.element;
        this.slides = Array.from(
            this.rootElement.querySelectorAll(".slider-list__item")
        );
        this.slidesLength = this.slides.length;
        this.current = 0;
        this.isAnimating = false;
        this.direction = 1; // -1
        this.baseAnimeSettings = {
            rotation: 45,
            duration: 750,
            easing: 'easeInOutCirc'
        };
        this.baseAnimeSettingsBack = {
            rotation: 45,
            duration: 1850,
            elasticity: (el: any, i: any, l: any) => 200 + i * 200
        };
        this.baseAnimeSettingsFront = {
            rotation: 45,
            duration: 2250,
            elasticity: (el: any, i: any, l: any) => 200 + i * 200
        };
        this.baseAnimeSettingsTitle = {
            rotation: 45,
            duration: 1750,
            elasticity: (el: any, i: any, l: any) => 200 + i * 200
        };

        this.navBar = this.rootElement.querySelector(".slider__nav-bar");
        this.thumbs = Array.from(this.rootElement.querySelectorAll(".nav-control"));

        this.slides[this.current].classList.add("slider-list__item_active");
        this.thumbs[this.current].classList.add("nav-control_active");

        this._bindEvents();
    }

    goTo(index: any, dir: any) {
        if (this.isAnimating) return;
        let prevSlide = this.slides[this.current];
        let nextSlide = this.slides[index];

        this.isAnimating = true;
        this.current = index;
        nextSlide.classList.add("slider-list__item_active");

        anime({
            ...this.baseAnimeSettings,
            targets: nextSlide,
            rotate: [90 * dir + 'deg', 0],
            translateX: [90 * dir + '%', 0]
        });

        anime({
            ...this.baseAnimeSettingsBack,
            targets: nextSlide.querySelectorAll('.back__element'),
            rotate: [90 * dir + 'deg', 0],
            translateX: [90 * dir + '%', 0]
        });

        anime({
            ...this.baseAnimeSettingsFront,
            targets: nextSlide.querySelectorAll('.front__element'),
            rotate: [90 * dir + 'deg', 0],
            translateX: [90 * dir + '%', 0]
        });

        anime({
            ...this.baseAnimeSettingsTitle,
            targets: nextSlide.querySelectorAll('.title__element'),
            rotate: [90 * dir + 'deg', 0],
            translateX: [90 * dir + '%', 0]
        });

        anime({
            ...this.baseAnimeSettings,
            targets: prevSlide,
            rotate: [0, -90 * dir + 'deg'],
            translateX: [0, -150 * dir + '%'],
            complete: (anim: any) => {
                this.isAnimating = false;
                prevSlide.classList.remove("slider-list__item_active");
                this.thumbs.forEach((item: any, index: any) => {
                    const action = index === this.current ? "add" : "remove";
                    item.classList[action]("nav-control_active");
                });
            }
        });
    }

    goStep(dir: any) {
        let index = this.current + dir;
        let len = this.slidesLength;
        let currentIndex = (index + len) % len;
        this.goTo(currentIndex, dir);
    }

    goNext() {
        this.goStep(1);
    }

    goPrev() {
        this.goStep(-1);
    }

    _navClickHandler(e: any) {
        if (this.isAnimating) return;
        let target = e.target.closest(".nav-control");
        if (!target) return;
        let index = this.thumbs.indexOf(target);
        if (index === this.current) return;
        let direction = index > this.current ? 1 : -1;
        this.goTo(index, direction);
    }

    _bindEvents() {
        ["_navClickHandler"].forEach((method) => {
          this[method] = this[method].bind(this);
        });
        this.navBar.addEventListener("click", this._navClickHandler);
    }
}

