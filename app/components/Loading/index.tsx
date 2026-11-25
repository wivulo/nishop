"use client";

import { FaSpinner } from 'react-icons/fa';
import { iLoading } from './iLoading';

export default function Loading({ isPedding }: iLoading) {
  if (!isPedding) return null;
  return <div role="status" aria-live="polite" className="fixed inset-0 z-50 grid place-items-center bg-[#1b1714]/35 p-4 backdrop-blur-sm">
    <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 text-sm font-semibold text-main-regular shadow-2xl">
      <FaSpinner aria-hidden="true" className="animate-spin text-xl text-main-primary" />
      A processar…
    </div>
  </div>;
}
