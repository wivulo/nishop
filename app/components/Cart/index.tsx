"use client";

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import { Button } from '../Button';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { 
    decreaseQuantityPerProduct, 
    clearCart,
    hideCart, 
    increaseQuantityPerProduct, 
    removeProduct, 
    updatecart
} from '@/lib/redux/Cart/cartSlice';
import anime from 'animejs';
import { Productcard } from '../ProductCard';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { hideCartAnimation, showCartAnimation } from './animations';
import { useSessionStorage, useLocalStorage } from '@react-hooks-library/core';
import { iCart, iCartProduct } from '@/app/models/icart';
import { iProduct } from '@/app/models/iProduct';

type BayqiPayment = {
    paymentId: string;
    status: string;
    merchantReference: string;
    amount?: number;
    currency?: string;
};

const checkoutAttemptStorageKey = 'nishop-bayqi-checkout-attempt';

const paymentStatusText: Record<string, string> = {
    CREATED: 'Pedido criado. Aguardando a confirmação na BayQi Wallet.',
    PENDING_CUSTOMER: 'Abre a BayQi Wallet e confirma este pagamento. PIN e OTP são introduzidos apenas na Wallet.',
    PROCESSING: 'A BayQi está a confirmar o pagamento.',
    SUCCEEDED: 'Pagamento confirmado pela BayQi.',
    FAILED: 'Pagamento recusado ou não concluído. Podes tentar novamente.',
    UNKNOWN: 'O estado ainda está a ser confirmado. Consulta novamente antes de repetir o pagamento.',
};

const shoppingCartInitialValue = {
    products: [] as iCartProduct[],
        quantity: 0,
        total: 0,
        showCart: false
}

const Cart: React.FC = () => {
    const { showCart, products, quantity, total } = useSelector((state: ReduxState) => state.cart);
    const dispatch = useDispatch()
    const cartRef = useRef<HTMLDivElement>(null)
    const [shoppingCart, setShoppingCart] = useSessionStorage<iCart>("Shopping-Cart", shoppingCartInitialValue)
    const [bayqiTag, setBayqiTag] = useState('');
    const [payment, setPayment] = useState<BayqiPayment | null>(null);
    const [checkoutError, setCheckoutError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pollMessage, setPollMessage] = useState('');
    const [pollCycle, setPollCycle] = useState(0);

    const handleCloseCart = () => dispatch(hideCart())
    const handleRemoveProduct = (id?: number) => {
        if(!id) return
        dispatch(removeProduct({id: id}))
    }

    const handleIncreaseProduct = (id?: number) => {
        if(!id) return
        dispatch(increaseQuantityPerProduct({id: id}))
        dispatch( showNotification({message: "Product quantity increased"}))
    }
    const handledecreaseProduct = (id?: number) => {
        if(!id) return
        dispatch(decreaseQuantityPerProduct({id: id}))
    }

    useEffect(() => {
        showCart? showCartAnimation(anime, cartRef.current) : hideCartAnimation(anime, cartRef.current);
    }, [showCart]);

    useEffect(() => {
        let sessionShoppingCart = sessionStorage.getItem("Shopping-Cart")
        const sessionCartSerialized = sessionShoppingCart && JSON.parse(sessionShoppingCart)
        
        if(quantity === -1 && (sessionCartSerialized && sessionCartSerialized.quantity)){
            dispatch(updatecart({
                products: sessionCartSerialized.products,
                quantity: sessionCartSerialized.quantity,
                total: sessionCartSerialized.total
            }))
        }
    }, []);

    useEffect(() => {
        let sessionShoppingCart = shoppingCart;
        if(quantity >= 0){
            sessionShoppingCart = {
                products: products,
                quantity: quantity,
                total: total,
                showCart: false
            }
            setShoppingCart(sessionShoppingCart);
        }
    }, [quantity])

    useEffect(() => {
        if (!payment || !['CREATED', 'PENDING_CUSTOMER', 'PROCESSING', 'UNKNOWN'].includes(payment.status)) return;

        let active = true;
        let attempts = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const poll = async () => {
            if (!active) return;
            if (attempts >= 22) {
                setPollMessage('A confirmação está a demorar. Podes consultar o estado novamente sem criar outra cobrança.');
                return;
            }

            timer = setTimeout(async () => {
                attempts += 1;
                try {
                    const response = await fetch(`/api/bayqi/payments/${encodeURIComponent(payment.paymentId)}`, {
                        cache: 'no-store',
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message ?? 'Não foi possível consultar o pagamento.');
                    if (!active) return;
                    setPayment(current => current ? { ...current, status: result.status } : current);
                    setPollMessage('');
                } catch (error) {
                    if (active) setPollMessage(error instanceof Error ? error.message : 'Falha ao consultar o estado.');
                }
                poll();
            }, 3000);
        };

        poll();
        return () => {
            active = false;
            if (timer) clearTimeout(timer);
        };
    }, [payment?.paymentId, payment?.status, pollCycle]);

    useEffect(() => {
        if (payment?.status === 'SUCCEEDED') {
            dispatch(clearCart());
            sessionStorage.removeItem(checkoutAttemptStorageKey);
        } else if (payment?.status === 'FAILED') {
            sessionStorage.removeItem(checkoutAttemptStorageKey);
        }
    }, [payment?.status, dispatch]);

    const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!products.length || isSubmitting || (payment && !['FAILED', 'SUCCEEDED'].includes(payment.status))) return;

        setIsSubmitting(true);
        setCheckoutError('');
        setPollMessage('');
        setPayment(null);

        const normalizedTag = bayqiTag.trim();
        const items = products.map(item => ({ productId: item.product.id, quantity: item.quatity }));
        const fingerprint = JSON.stringify({ items, bayqiTag: normalizedTag });
        let attemptId: string;
        try {
            const saved = sessionStorage.getItem(checkoutAttemptStorageKey);
            const parsed = saved ? JSON.parse(saved) as { fingerprint?: string; attemptId?: string } : null;
            attemptId = parsed?.fingerprint === fingerprint && parsed.attemptId
                ? parsed.attemptId
                : window.crypto.randomUUID();
            sessionStorage.setItem(checkoutAttemptStorageKey, JSON.stringify({ fingerprint, attemptId }));
        } catch {
            attemptId = window.crypto.randomUUID();
        }

        try {
            const response = await fetch('/api/bayqi/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, bayqiTag: normalizedTag, attemptId }),
            });
            const result = await response.json();
            if (!response.ok) {
                const supportRef = result.requestId ? ` Referência de suporte: ${result.requestId}.` : '';
                throw new Error((result.message ?? 'Não foi possível iniciar o pagamento.') + supportRef);
            }
            setPayment({
                paymentId: result.paymentId,
                status: result.status,
                merchantReference: result.merchantReference,
                amount: result.amount,
                currency: result.currency,
            });
        } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={cartRef}
            className={`fixed flex transform ${showCart ? "translate-x-0" : "translate-x-full"} right-0 top-0
            w-96 h-screen bg-base-soft shadow shadow-black z-[70] px-3 pt-20 transition-all`}
        >
            <div className='absolute top-0 left-0 flex justify-between w-full p-2'>
                <h3 className='text-main-third text-3xl font-semibold'>Cart</h3>

                <Button.Root className='group' onClick={handleCloseCart}>
                    <Button.Icon icon={FaTimes} className='group-hover:text-[#ff0000]' />
                </Button.Root>
            </div>

            <div className='flex h-full min-h-0 w-full flex-col'>
                <div className='w-full min-h-0 flex-1 overflow-y-auto'>
                    <ul className={`h-auto w-full overflow-y-auto flex flex-col 
                        ${!products.length && " h-full justify-center items-center"} relative`
                    }>
                        {
                            products.length > 0 ?
                                products.map(cartItem => (
                                    <li key={cartItem.product.id} className='relative animate-translateX'>
                                        <Productcard.Root className='flex-row w-full h-24'>
                                            <Productcard.Image src={cartItem.product.imageSrc} width={300} height={300} className='w-20 h-20 basis-1/3' alt={cartItem.product.name} />
                                            <Productcard.Description text={cartItem.product.description} className='basis-2/3' />
                                            <Productcard.Remove className='my-6' onClick={() => handleRemoveProduct(cartItem.product.id)}/>
                                        </Productcard.Root>

                                        <div className='absolute bottom-2 left-1/3 flex gap-3'>
                                            <Button.Root hoverScale className='rounded-none'
                                                onClick={() => handleIncreaseProduct(cartItem.product.id)}>
                                                <Button.Icon icon={FaPlus} />
                                            </Button.Root>

                                            <p className='w-8 h-8 p-1 text-center'> {cartItem.quatity} </p>

                                            <Button.Root hoverScale className='rounded-none'
                                                onClick={() => handledecreaseProduct(cartItem.product.id)}>
                                                <Button.Icon icon={FaMinus} />
                                            </Button.Root>
                                        </div>
                                    </li>
                                ))
                                :
                                (
                                    <div className='flex'>
                                        <p className='text-center text-xs text-text-2 font-semibold'>Please, select some product to view here!</p>
                                    </div>
                                )
                        }
                    </ul>
                </div>

                <div className='shrink-0 py-2'>
                    <p>Quantity: {quantity >= 0 ? quantity : 0 }</p>
                    <p>Total: {total.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz</p>
                </div>

                <form onSubmit={handleCheckout} className='mt-3 flex flex-col gap-2 border-t border-main-border pt-3'>
                    <label htmlFor='bayqi-tag' className='text-sm font-semibold'>BayQi Tag do pagador</label>
                    <input
                        id='bayqi-tag'
                        value={bayqiTag}
                        onChange={event => setBayqiTag(event.target.value)}
                        placeholder='@cliente-teste'
                        maxLength={64}
                        required
                        className='rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900'
                        autoComplete='off'
                    />
                    <button
                        type='submit'
                        disabled={!products.length || isSubmitting || Boolean(payment && !['FAILED', 'SUCCEEDED'].includes(payment.status))}
                        className='rounded bg-main-third px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {isSubmitting ? 'A iniciar pagamento…' : 'Pagar com BayQi'}
                    </button>
                    <p className='text-xs text-gray-600'>O PIN e o OTP, se necessários, são confirmados apenas na BayQi Wallet.</p>

                    {checkoutError && <p role='alert' className='text-sm text-red-700'>{checkoutError}</p>}
                    {payment && (
                        <div aria-live='polite' className='rounded border border-gray-200 bg-white p-3 text-sm text-gray-800'>
                            <p className='font-semibold'>{paymentStatusText[payment.status] ?? `Estado: ${payment.status}`}</p>
                            {payment.amount !== undefined && <p className='mt-1'>Valor: {payment.amount.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {payment.currency === 'AOA' ? 'Kz' : payment.currency}</p>}
                            <p className='mt-1 text-xs'>Referência: {payment.merchantReference}</p>
                            <p className='text-xs'>Pagamento: {payment.paymentId}</p>
                            {pollMessage && <p className='mt-2 text-amber-800'>{pollMessage}</p>}
                            {['CREATED', 'PENDING_CUSTOMER', 'PROCESSING', 'UNKNOWN'].includes(payment.status) && (
                                <button
                                    type='button'
                                    onClick={() => { setPollMessage(''); setPollCycle(value => value + 1); }}
                                    className='mt-2 text-xs font-semibold underline'
                                >
                                    Consultar estado agora
                                </button>
                            )}
                            {payment.status === 'SUCCEEDED' && <p className='mt-2 font-semibold text-green-700'>Compra concluída.</p>}
                        </div>
                    )}
                </form>
            </div>

        </div>
    );
};

export default Cart;
