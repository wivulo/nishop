"use client";

import React, { FormEvent, useEffect, useState } from 'react';
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
import { Productcard } from '../ProductCard';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
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
        dispatch( showNotification({message: "Quantidade atualizada."}))
    }
    const handledecreaseProduct = (id?: number) => {
        if(!id) return
        dispatch(decreaseQuantityPerProduct({id: id}))
    }

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
        <>
        {showCart && <button type="button" aria-label="Fechar carrinho" onClick={handleCloseCart} className="fixed inset-0 z-[69] bg-[#1b1714]/50 backdrop-blur-sm" />}
        <aside aria-label="Carrinho de compras" aria-hidden={!showCart}
            className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-md flex-col bg-[#fdfbf8] px-5 pb-5 pt-20 shadow-2xl transition-transform duration-300 ease-out sm:px-7 ${showCart ? "translate-x-0" : "pointer-events-none translate-x-full"}`}
        >
            <div className='absolute left-0 top-0 flex w-full items-center justify-between border-b border-[#eee6de] px-5 py-4 sm:px-7'>
                <h3 className='text-xl font-bold text-main-regular'>O teu carrinho</h3>
                <Button.Root className='grid h-9 w-9 place-items-center bg-white text-main-regular hover:bg-[#fff0e5]' onClick={handleCloseCart}>
                    <Button.Icon icon={FaTimes} />
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
                                    <li key={cartItem.product.id} className='relative mb-3 rounded-2xl border border-[#eee6de] bg-white p-2'>
                                        <Productcard.Root className='flex-row w-full h-24 border-0 shadow-none'>
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
                                        <p className='text-center text-sm text-main-medium'>O carrinho está vazio. Explora a coleção e escolhe algo especial.</p>
                                    </div>
                                )
                        }
                    </ul>
                </div>

                <div className='flex shrink-0 items-center justify-between border-t border-[#eee6de] py-4 text-sm text-main-medium'>
                    <p>{quantity >= 0 ? quantity : 0 } {quantity === 1 ? 'produto' : 'produtos'}</p>
                    <p className="text-lg font-bold text-main-regular">{(Number.isFinite(total) ? total : 0).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz</p>
                </div>

                <form onSubmit={handleCheckout} className='flex flex-col gap-2 border-t border-[#eee6de] pt-4'>
                    <label htmlFor='bayqi-tag' className='text-sm font-semibold'>BayQi Tag do pagador</label>
                    <input
                        id='bayqi-tag'
                        value={bayqiTag}
                        onChange={event => setBayqiTag(event.target.value)}
                        placeholder='@cliente-teste'
                        maxLength={64}
                        required
                        className='rounded-2xl border border-[#e9ddd2] bg-white px-4 py-3 text-sm text-main-regular focus:border-main-primary'
                        autoComplete='off'
                    />
                    <button
                        type='submit'
                        disabled={!products.length || isSubmitting || Boolean(payment && !['FAILED', 'SUCCEEDED'].includes(payment.status))}
                        className='shop-button shop-button-primary disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {isSubmitting ? 'A iniciar pagamento…' : 'Pagar com BayQi'}
                    </button>
                    <p className='text-xs leading-5 text-main-medium'>O PIN e o OTP, se necessários, são confirmados apenas na BayQi Wallet.</p>

                    {checkoutError && <p role='alert' className='text-sm text-system-error'>{checkoutError}</p>}
                    {payment && (
                        <div aria-live='polite' className='rounded-2xl border border-[#eee6de] bg-white p-3 text-sm text-main-regular'>
                            <p className='font-semibold'>{paymentStatusText[payment.status] ?? `Estado: ${payment.status}`}</p>
                            {payment.amount !== undefined && <p className='mt-1'>Valor: {payment.amount.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {payment.currency === 'AOA' ? 'Kz' : payment.currency}</p>}
                            <p className='mt-1 text-xs'>Referência: {payment.merchantReference}</p>
                            <p className='text-xs'>Pagamento: {payment.paymentId}</p>
                            {pollMessage && <p className='mt-2 text-system-warning'>{pollMessage}</p>}
                            {['CREATED', 'PENDING_CUSTOMER', 'PROCESSING', 'UNKNOWN'].includes(payment.status) && (
                                <button
                                    type='button'
                                    onClick={() => { setPollMessage(''); setPollCycle(value => value + 1); }}
                                    className='mt-2 text-xs font-semibold underline'
                                >
                                    Consultar estado agora
                                </button>
                            )}
                            {payment.status === 'SUCCEEDED' && <p className='mt-2 font-semibold text-system-success'>Compra concluída.</p>}
                        </div>
                    )}
                </form>
            </div>

        </aside>
        </>
    );
};

export default Cart;
