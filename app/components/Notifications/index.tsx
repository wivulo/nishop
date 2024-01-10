"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import Notification from "@/app/components/Notification";

const Notifications: React.FC = () => {
    const {isOpen, notifications} = useSelector((state: ReduxState) => state.notification);

    return (
        <div className={`flex fixed z-[60] top-5 self-center w-full h-auto`}>
            <ul className='flex w-full flex-col gap-3 justify-center items-center'>
                {
                    notifications.map(notification => (
                        <Notification isOpen message={notification.message} key={notification.id} type={notification.type} />
                    ))
                }
            </ul>
        </div>
    );
};

export default Notifications;
