"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { createUser } from '@/app/(auth)/actions';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { ERequestState } from '@/app/models/eRequestState';
import AuthFrame from '@/app/components/AuthFrame';
import Loading from '@/app/components/Loading';

export default function Registration() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      dispatch(showNotification({ message: data.message, type: data.state === ERequestState.success ? 'success' : data.state === ERequestState.error ? 'error' : 'warning' }));
      if (data.user) router.push('/login');
    },
    onError: () => dispatch(showNotification({ message: 'Não foi possível criar a conta. Tenta novamente.', type: 'error' })),
  });

  return <>
    <AuthFrame eyebrow="Começa por aqui" title="Cria a tua conta." description="Junta-te à Nishop e descobre produtos escolhidos para cada ocasião." footer={<>Já tens conta? <Link href="/login" className="font-semibold text-main-primary hover:underline">Iniciar sessão</Link></>}>
      <form name="registration" action={(data) => mutate(data)} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm font-semibold text-main-regular">Nome
          <input type="text" name="name" autoComplete="name" required placeholder="O teu nome" className="h-14 rounded-2xl border border-[#e9ddd2] bg-white px-5 text-sm font-normal outline-none transition-colors focus:border-main-primary" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-main-regular">Email
          <input type="email" name="email" autoComplete="email" required placeholder="O teu email" className="h-14 rounded-2xl border border-[#e9ddd2] bg-white px-5 text-sm font-normal outline-none transition-colors focus:border-main-primary" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-main-regular">Palavra-passe
          <input type="password" name="password" autoComplete="new-password" required placeholder="Cria uma palavra-passe" className="h-14 rounded-2xl border border-[#e9ddd2] bg-white px-5 text-sm font-normal outline-none transition-colors focus:border-main-primary" />
        </label>
        <button type="submit" disabled={isPending} className="shop-button shop-button-primary mt-2 w-full disabled:opacity-60">{isPending ? 'A criar conta…' : 'Criar conta'}</button>
      </form>
    </AuthFrame>
    <Loading isPedding={isPending} />
  </>;
}
