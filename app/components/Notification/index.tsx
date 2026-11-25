"use client";

type Props = { message: string; isOpen: boolean; type?: string };

export default function Notification({ message, isOpen, type }: Props) {
  if (!isOpen) return null;
  const accent = type === 'success' ? 'border-system-success' : type === 'warning' ? 'border-system-warning' : 'border-system-error';
  return <li role={type === 'error' ? 'alert' : 'status'} className={`shop-fade-in w-full rounded-2xl border-l-4 bg-white px-5 py-4 text-sm font-medium leading-6 text-main-regular shadow-xl ${accent}`}>
    {message}
  </li>;
}
