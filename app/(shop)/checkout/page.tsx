"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaLock, FaMobileAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import { ReduxState } from '@/lib/redux';
import { clearCart } from '@/lib/redux/Cart/cartSlice';
import { iCartProduct } from '@/app/models/icart';

type IdentifierType = 'BAYQI_TAG' | 'PHONE' | 'IUF' | 'DOCUMENT';
type Payment = {
  paymentId: string; status: string; merchantReference: string;
  amount?: number; currency?: string; items: iCartProduct[];
};
type SavedCheckout = { cartFingerprint: string; fingerprint: string; attemptId: string; payment?: Payment };

const storageKey = 'nishop-bayqi-checkout-attempt';
const activeStates = ['CREATED', 'PENDING_CUSTOMER', 'PROCESSING', 'UNKNOWN'];
const identifiers: { type: IdentifierType; label: string; placeholder: string; hint: string }[] = [
  { type: 'BAYQI_TAG', label: 'BayQi Tag', placeholder: '@a-tua-tag', hint: 'O identificador da tua carteira BayQi.' },
  { type: 'PHONE', label: 'Telefone', placeholder: '923456789', hint: 'O número associado à carteira, sem espaços.' },
  { type: 'IUF', label: 'IUF', placeholder: '123456789', hint: 'O teu IUF de 9 dígitos.' },
  { type: 'DOCUMENT', label: 'Documento', placeholder: 'Número do BI, passaporte ou cartão', hint: 'BI, passaporte ou cartão de residente associado à conta.' },
];
const statusText: Record<string, string> = {
  CREATED: 'Pedido criado. Estamos a aguardar o processamento pela BayQi.',
  PENDING_CUSTOMER: 'Abre a BayQi Wallet e confirma o pedido de pagamento.',
  PROCESSING: 'A BayQi está a confirmar o pagamento.',
  UNKNOWN: 'O estado ainda está a ser confirmado. Consulta novamente antes de repetir o pagamento.',
  SUCCEEDED: 'Pagamento confirmado. Obrigado pela tua compra!',
  FAILED: 'Este pagamento não foi concluído. Podes tentar novamente.',
};

const formatMoney = (amount: number) => (Number.isFinite(amount) ? amount : 0).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const itemsFingerprint = (items: iCartProduct[]) => JSON.stringify(items.map(({ product, quatity }) => ({ productId: product.id ?? 0, quantity: quatity })).sort((a, b) => a.productId - b.productId));
const checkoutFingerprint = async (cart: string, type: IdentifierType, value: string) => {
  const bytes = new TextEncoder().encode(JSON.stringify({ cart, type, value }));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
};

export default function CheckoutPage() {
  const { products, quantity, total } = useSelector((state: ReduxState) => state.cart);
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState<'bayqi'>('bayqi');
  const [modalOpen, setModalOpen] = useState(false);
  const [identifierType, setIdentifierType] = useState<IdentifierType>('BAYQI_TAG');
  const [identifier, setIdentifier] = useState('');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [restored, setRestored] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [pollMessage, setPollMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollCycle, setPollCycle] = useState(0);
  const cartFingerprint = useMemo(() => itemsFingerprint(products), [products]);
  const displayItems = payment && payment.status !== 'FAILED' ? payment.items : products;
  const displayTotal = payment && payment.status !== 'FAILED' ? payment.amount ?? total : total;

  useEffect(() => {
    if (quantity < 0 || restored) return;
    setRestored(true);
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null') as SavedCheckout | null;
      if (saved?.payment?.paymentId && Array.isArray(saved.payment.items)) {
        if (saved.payment.status === 'SUCCEEDED' && products.length) {
          sessionStorage.removeItem(storageKey);
        } else setPayment(saved.payment);
      }
    } catch { /* Um estado antigo do browser não impede um novo checkout. */ }
  }, [quantity, restored, products]);

  useEffect(() => {
    if (!payment) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null') as SavedCheckout | null;
      if (payment.status === 'FAILED') sessionStorage.removeItem(storageKey);
      else if (saved) sessionStorage.setItem(storageKey, JSON.stringify({ ...saved, payment }));
    } catch { /* A consulta do pagamento continua disponível nesta sessão. */ }
    if (payment.status === 'SUCCEEDED') {
      try { sessionStorage.setItem('Shopping-Cart', JSON.stringify({ products: [], quantity: 0, total: 0, showCart: false })); }
      catch { /* A compra permanece confirmada no servidor. */ }
      dispatch(clearCart());
    }
  }, [payment, dispatch]);

  useEffect(() => {
    if (!payment || !activeStates.includes(payment.status)) return;
    let active = true;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      if (!active) return;
      if (attempts >= 24) {
        setPollMessage('A confirmação está a demorar. Usa “Consultar estado” para continuar sem criar outra cobrança.');
        return;
      }
      timer = setTimeout(async () => {
        attempts += 1;
        try {
          const response = await fetch(`/api/bayqi/payments/${encodeURIComponent(payment.paymentId)}`, { cache: 'no-store' });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message ?? 'Não foi possível consultar o pagamento.');
          if (!active) return;
          setPayment(current => current ? { ...current, status: result.status, amount: result.amount ?? current.amount } : current);
          setPollMessage('');
        } catch (error) {
          if (active) setPollMessage(error instanceof Error ? error.message : 'Falha ao consultar o estado.');
        }
        if (active) check();
      }, attempts === 0 && pollCycle > 0 ? 0 : 3000);
    };
    check();
    return () => { active = false; clearTimeout(timer); };
  }, [payment?.paymentId, payment?.status, pollCycle]);

  useEffect(() => {
    if (!modalOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && !isSubmitting) setModalOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [modalOpen, isSubmitting]);

  const beginPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!products.length || isSubmitting || payment && activeStates.includes(payment.status)) return;
    if (products.some(({ product }) => !Number.isInteger(product.id) || (product.id ?? 0) <= 0)) {
      setCheckoutError('O carrinho contém um produto inválido. Atualiza a página e tenta novamente.');
      return;
    }
    setCheckoutError('');
    setPollMessage('');
    setIsSubmitting(true);
    const normalized = identifier.trim();
    const fingerprint = await checkoutFingerprint(cartFingerprint, identifierType, normalized);
    let attemptId: string;
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null') as SavedCheckout | null;
      attemptId = saved?.fingerprint === fingerprint && saved.attemptId ? saved.attemptId : crypto.randomUUID();
    } catch { attemptId = crypto.randomUUID(); }
    sessionStorage.setItem(storageKey, JSON.stringify({ cartFingerprint, fingerprint, attemptId } satisfies SavedCheckout));

    try {
      const response = await fetch('/api/bayqi/payments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: products.map(({ product, quatity }) => ({ productId: product.id, quantity: quatity })),
          payer: { identifierType, identifier: normalized }, attemptId,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        const support = result.requestId ? ` Referência de suporte: ${result.requestId}.` : '';
        throw new Error((result.message ?? 'Não foi possível iniciar o pagamento.') + support);
      }
      const next: Payment = {
        paymentId: result.paymentId, status: result.status, merchantReference: result.merchantReference,
        amount: result.amount, currency: result.currency, items: products,
      };
      setPayment(next);
      setModalOpen(false);
      setIdentifier('');
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.');
    } finally { setIsSubmitting(false); }
  };

  return <main className="shop-shell min-h-[70vh] pb-24 pt-10 md:pt-14">
    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-main-medium hover:text-main-primary"><FaArrowLeft aria-hidden="true" /> Continuar a comprar</Link>
    <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
      <div><span className="shop-eyebrow">Finalização da compra</span><h1 className="mt-3 text-4xl font-bold tracking-tight text-main-regular md:text-5xl">Checkout</h1></div>
      <span className="inline-flex items-center gap-2 rounded-full bg-[#eef7ea] px-4 py-2 text-xs font-semibold text-[#487b3b]"><FaLock aria-hidden="true" /> Pagamento protegido</span>
    </div>

    <div className="mt-10 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-7">
        {payment && <section className={`shop-fade-in rounded-[1.5rem] border p-6 sm:p-8 ${payment.status === 'SUCCEEDED' ? 'border-[#cbe6c1] bg-[#f4fbf1]' : payment.status === 'FAILED' ? 'border-[#f0c5c5] bg-[#fff6f4]' : 'border-[#f2dccb] bg-[#fff9f3]'}`} aria-live="polite">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-main-primary">{payment.status === 'SUCCEEDED' ? <FaCheckCircle aria-hidden="true" /> : <FaSpinner aria-hidden="true" className={activeStates.includes(payment.status) ? 'animate-spin' : ''} />}</span>
            <div><h2 className="text-xl font-bold text-main-regular">{payment.status === 'SUCCEEDED' ? 'Compra concluída' : payment.status === 'FAILED' ? 'Pagamento não concluído' : 'Aguardamos a confirmação'}</h2>
              <p className="mt-2 text-sm leading-6 text-main-medium">{statusText[payment.status] ?? 'A confirmar o estado do pagamento.'}</p>
              {payment.status === 'PENDING_CUSTOMER' && <p className="mt-2 text-sm text-main-medium">O PIN e o OTP são introduzidos apenas na BayQi Wallet.</p>}
              <p className="mt-4 text-xs text-main-medium">Referência: {payment.merchantReference}</p>
              <p className="mt-1 text-xs text-main-medium">Pagamento: {payment.paymentId}</p>
              {pollMessage && <p className="mt-3 text-sm text-system-warning">{pollMessage}</p>}
              {activeStates.includes(payment.status) && <button type="button" onClick={() => { setPollMessage(''); setPollCycle(value => value + 1); }} className="mt-4 text-sm font-semibold text-main-primary hover:underline">Consultar estado</button>}
              {payment.status === 'FAILED' && products.length > 0 && <button type="button" onClick={() => { setPayment(null); setModalOpen(true); }} className="shop-button shop-button-primary mt-5">Tentar novamente</button>}
            </div>
          </div>
        </section>}

        {!payment && <section className="rounded-[1.5rem] border border-[#eee6de] bg-white p-6 sm:p-8">
          <span className="shop-eyebrow">Passo 1 de 2</span>
          <h2 className="mt-2 text-2xl font-bold text-main-regular">Escolhe como pagar</h2>
          <p className="mt-2 text-sm leading-6 text-main-medium">Seleciona o método. A identificação da conta BayQi é feita no passo seguinte.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button type="button" aria-pressed={selectedMethod === 'bayqi'} onClick={() => setSelectedMethod('bayqi')} className="flex min-h-36 flex-col items-start rounded-2xl border-2 border-main-primary bg-[#fff9f3] p-5 text-left transition-transform hover:-translate-y-1">
              <FaMobileAlt aria-hidden="true" className="text-2xl text-main-primary" /><strong className="mt-4 text-main-regular">Carteira BayQi</strong><span className="mt-1 text-xs text-main-medium">Confirma o pedido na Wallet.</span>
            </button>
            <div aria-disabled="true" className="flex min-h-36 flex-col items-start rounded-2xl border border-[#eee6de] bg-[#f7f5f2] p-5 opacity-70">
              <FaCreditCard aria-hidden="true" className="text-2xl text-main-medium" /><strong className="mt-4 text-main-regular">Multicaixa Express</strong><span className="mt-1 text-xs font-semibold text-main-primary">Em breve</span>
            </div>
          </div>
          <button type="button" disabled={!products.length || quantity < 0} onClick={() => setModalOpen(true)} className="shop-button shop-button-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">Continuar com BayQi</button>
          {checkoutError && <p role="alert" className="mt-4 text-sm text-system-error">{checkoutError}</p>}
        </section>}

        <section className="rounded-[1.5rem] border border-[#eee6de] bg-white p-6 sm:p-8">
          <span className="shop-eyebrow">Como funciona</span><h2 className="mt-2 text-xl font-bold text-main-regular">Pagamento com a Wallet</h2>
          <ol className="mt-5 space-y-4 text-sm leading-6 text-main-medium">
            <li><strong className="mr-3 text-main-primary">01</strong> Escolhe uma forma de identificar a tua conta BayQi.</li>
            <li><strong className="mr-3 text-main-primary">02</strong> Recebe o pedido e confirma na BayQi Wallet.</li>
            <li><strong className="mr-3 text-main-primary">03</strong> Aguarda a confirmação nesta página.</li>
          </ol>
        </section>
      </div>

      <aside className="rounded-[1.5rem] border border-[#eee6de] bg-white p-6 lg:sticky lg:top-6" aria-label="Resumo da compra">
        <h2 className="text-xl font-bold text-main-regular">Resumo da compra</h2>
        {quantity < 0 && !payment ? <p className="mt-6 text-sm text-main-medium">A carregar carrinho…</p> : displayItems.length ? <ul className="mt-6 max-h-80 space-y-4 overflow-y-auto">
          {displayItems.map(({ product, quatity }) => <li key={product.id} className="flex gap-3 border-b border-[#f0e9e2] pb-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f7f2ed]">{product.imageSrc && <img src={product.imageSrc} alt="" className="h-full w-full object-contain p-1" />}</div>
            <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold text-main-regular">{product.description || product.name}</p><p className="mt-1 text-xs text-main-medium">Quantidade: {quatity}</p></div>
            <span className="shrink-0 text-sm font-semibold text-main-regular">{formatMoney(product.price * quatity)} Kz</span>
          </li>)}
        </ul> : <p className="mt-6 text-sm text-main-medium">O carrinho está vazio. <Link href="/products" className="font-semibold text-main-primary hover:underline">Ver produtos</Link></p>}
        <div className="mt-6 space-y-3 border-t border-[#eee6de] pt-5 text-sm text-main-medium"><div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(displayTotal)} Kz</span></div><div className="flex justify-between"><span>Taxa de pagamento</span><span>0,00 Kz</span></div></div>
        <div className="mt-5 flex justify-between border-t border-[#eee6de] pt-5 text-lg font-bold text-main-regular"><span>Total</span><span>{formatMoney(displayTotal)} Kz</span></div>
        <p className="mt-5 text-xs leading-5 text-main-medium">O valor final é confirmado pelo servidor antes de enviar o pedido ao Gateway.</p>
      </aside>
    </div>

    {modalOpen && <div role="dialog" aria-modal="true" aria-labelledby="payer-modal-title" onClick={() => !isSubmitting && setModalOpen(false)} className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#1b1714]/65 p-4 backdrop-blur-sm">
      <div onClick={(event) => event.stopPropagation()} className="shop-fade-in my-auto w-full max-w-xl rounded-[1.7rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><span className="shop-eyebrow">Passo 2 de 2</span><h2 id="payer-modal-title" className="mt-2 text-2xl font-bold text-main-regular">Encontra a tua conta BayQi</h2></div><button type="button" disabled={isSubmitting} onClick={() => setModalOpen(false)} aria-label="Fechar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f7f2ed] text-main-regular"><FaTimes aria-hidden="true" /></button></div>
        <p className="mt-3 text-sm leading-6 text-main-medium">Escolhe um identificador associado à tua Wallet. Nunca introduzas PIN ou OTP aqui.</p>
        <form onSubmit={beginPayment} className="mt-6">
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Forma de identificar a conta">
            {identifiers.map((option) => <button key={option.type} type="button" aria-pressed={identifierType === option.type} onClick={() => { setIdentifierType(option.type); setIdentifier(''); setCheckoutError(''); }} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${identifierType === option.type ? 'border-main-primary bg-[#fff0e5] text-main-primary' : 'border-[#e9ddd2] text-main-medium hover:border-main-primary'}`}>{option.label}</button>)}
          </div>
          <label className="mt-6 flex flex-col gap-2 text-sm font-semibold text-main-regular">{identifiers.find(option => option.type === identifierType)?.label}
            <input autoFocus required value={identifier} onChange={(event) => setIdentifier(event.target.value)} type={identifierType === 'PHONE' ? 'tel' : 'text'} maxLength={64} placeholder={identifiers.find(option => option.type === identifierType)?.placeholder} className="h-14 rounded-2xl border border-[#e9ddd2] bg-white px-5 font-normal outline-none focus:border-main-primary" />
          </label>
          <p className="mt-2 text-xs text-main-medium">{identifiers.find(option => option.type === identifierType)?.hint}</p>
          {checkoutError && <p role="alert" className="mt-4 text-sm text-system-error">{checkoutError}</p>}
          <button type="submit" disabled={isSubmitting || !identifier.trim()} className="shop-button shop-button-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'A iniciar pagamento…' : `Pagar ${formatMoney(total)} Kz com BayQi`}</button>
        </form>
      </div>
    </div>}
  </main>;
}
