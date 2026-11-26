"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { ReduxState } from '@/lib/redux';
import {
  decreaseQuantityPerProduct, hideCart, increaseQuantityPerProduct,
  removeProduct, updatecart,
} from '@/lib/redux/Cart/cartSlice';

const formatPrice = (value: number) => (Number.isFinite(value) ? value : 0).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Cart() {
  const { showCart, products, quantity, total } = useSelector((state: ReduxState) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (quantity !== -1) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem('Shopping-Cart') || 'null');
      if (saved && Array.isArray(saved.products) && Number.isInteger(saved.quantity) && Number.isFinite(saved.total)) {
        dispatch(updatecart({ products: saved.products, quantity: saved.quantity, total: saved.total }));
        return;
      }
    } catch { /* Sessão antiga ou inválida: iniciar um carrinho vazio. */ }
    dispatch(updatecart({ products: [], quantity: 0, total: 0 }));
  }, [quantity, dispatch]);

  useEffect(() => {
    if (quantity < 0) return;
    sessionStorage.setItem('Shopping-Cart', JSON.stringify({ products, quantity, total, showCart: false }));
  }, [products, quantity, total]);

  useEffect(() => {
    if (!showCart) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') dispatch(hideCart()); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showCart, dispatch]);

  return <>
    {showCart && <button type="button" aria-label="Fechar carrinho" onClick={() => dispatch(hideCart())} className="fixed inset-0 z-[69] bg-[#1b1714]/50 backdrop-blur-sm" />}
    <aside aria-label="Carrinho de compras" aria-hidden={!showCart} className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-md flex-col bg-[#fdfbf8] px-5 pb-5 pt-20 shadow-2xl transition-transform duration-300 ease-out sm:px-7 ${showCart ? 'translate-x-0' : 'pointer-events-none translate-x-full'}`}>
      <div className="absolute left-0 top-0 flex w-full items-center justify-between border-b border-[#eee6de] px-5 py-4 sm:px-7">
        <h2 className="text-xl font-bold text-main-regular">O teu carrinho</h2>
        <button type="button" onClick={() => dispatch(hideCart())} aria-label="Fechar carrinho" className="grid h-9 w-9 place-items-center rounded-full bg-white text-main-regular hover:bg-[#fff0e5]"><FaTimes aria-hidden="true" /></button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {quantity < 0 ? <p className="py-10 text-center text-sm text-main-medium">A carregar carrinho…</p> : products.length ? <ul className="space-y-3">
          {products.map(({ product, quatity }) => <li key={product.id} className="rounded-2xl border border-[#eee6de] bg-white p-3">
            <div className="flex gap-3">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f7f2ed]">
                {product.imageSrc && <img src={product.imageSrc} alt="" className="h-full w-full object-contain p-2" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold leading-5 text-main-regular">{product.description || product.name}</p>
                <p className="mt-1 text-sm font-bold text-main-primary">{formatPrice(product.price)} Kz</p>
              </div>
              <button type="button" aria-label={`Remover ${product.name}`} onClick={() => dispatch(removeProduct({ id: product.id }))} className="h-7 text-xs font-semibold text-main-medium hover:text-system-error">Remover</button>
            </div>
            <div className="mt-3 flex items-center justify-end gap-3">
              <button type="button" aria-label={`Diminuir quantidade de ${product.name}`} onClick={() => dispatch(decreaseQuantityPerProduct({ id: product.id }))} className="grid h-8 w-8 place-items-center rounded-full border border-[#e9ddd2] text-main-regular hover:border-main-primary"><FaMinus size={11} aria-hidden="true" /></button>
              <span className="min-w-5 text-center text-sm font-semibold">{quatity}</span>
              <button type="button" aria-label={`Aumentar quantidade de ${product.name}`} onClick={() => dispatch(increaseQuantityPerProduct({ id: product.id }))} className="grid h-8 w-8 place-items-center rounded-full border border-[#e9ddd2] text-main-regular hover:border-main-primary"><FaPlus size={11} aria-hidden="true" /></button>
            </div>
          </li>)}
        </ul> : <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-main-regular">O carrinho está vazio.</p>
          <p className="mt-2 text-sm text-main-medium">Explora a coleção e escolhe algo especial.</p>
          <Link href="/products" onClick={() => dispatch(hideCart())} className="shop-button shop-button-primary mt-6">Ver produtos</Link>
        </div>}
      </div>

      {products.length > 0 && <div className="shrink-0 border-t border-[#eee6de] pt-5">
        <div className="flex justify-between text-sm text-main-medium"><span>{quantity} {quantity === 1 ? 'produto' : 'produtos'}</span><span>Subtotal</span></div>
        <div className="mt-2 flex items-center justify-between text-lg font-bold text-main-regular"><span>Total</span><span>{formatPrice(total)} Kz</span></div>
        <Link href="/checkout" onClick={() => dispatch(hideCart())} className="shop-button shop-button-primary mt-5 w-full">Continuar para checkout</Link>
      </div>}
    </aside>
  </>;
}
