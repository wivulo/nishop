"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import { hideNotification } from '@/lib/redux/Notification/notificationSlice';
import Notification from '@/app/components/Notification';

export default function Notifications() {
  const { notifications } = useSelector((state: ReduxState) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!notifications.length) return;
    const timer = window.setTimeout(() => dispatch(hideNotification()), 3500);
    return () => window.clearTimeout(timer);
  }, [notifications.length, dispatch]);

  if (!notifications.length) return null;
  return <ul className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">
    {notifications.map((notification, index) => <Notification key={notification.id ?? index} isOpen message={notification.message} type={notification.type} />)}
  </ul>;
}
