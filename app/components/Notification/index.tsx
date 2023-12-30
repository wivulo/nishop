"use client";

import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import anime from 'animejs';
import { hideNotification } from '@/lib/redux/Notification/notificationSlice';


const Notification: React.FC = () => {
    const {isOpen, message} = useSelector((state: ReduxState) => state.notification);
    const dispatch = useDispatch();
    const notificationRef = useRef<HTMLDivElement>(null);

    if(isOpen){
        notificationRef.current && anime({
            targets: notificationRef.current,
            translateY: ["100%", "0"],
            easing: "easeOutElastic",
            duration: 500
        })
    }

    setTimeout(() => {
        dispatch( hideNotification() );
    }, 2000);

    return (
        <div ref={notificationRef} className={`${isOpen? "flex" : "hidden"} fixed bg-system-success z-[60] 
        top-5 self-center p-5 rounded-lg`}>
            <p className='text-center text-xs'>{message}</p>
        </div>
    );
};

export default Notification;
