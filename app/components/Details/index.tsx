"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import { closeDetail } from '@/lib/redux/Details/detailsSlice';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { addProduct } from '@/lib/redux/Cart/cartSlice';
import { ERequestState } from '@/app/models/eRequestState';
import { FaTimes } from 'react-icons/fa';

export default function Details() {
  const { isOpen, product } = useSelector((state: ReduxState) => state.details);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen || !product?.id) return;
    void fetch('/api/analytics/product-view', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }), keepalive: true,
    }).catch(() => undefined);
  }, [isOpen, product?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') dispatch(closeDetail()); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen || !product) return null;

  const addToCart = () => {
    dispatch(addProduct(product));
    dispatch(showNotification({ message: 'Produto adicionado ao carrinho.', type: ERequestState.success }));
  };

  return <div role="dialog" aria-modal="true" aria-labelledby="product-detail-title" onClick={() => dispatch(closeDetail())} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1b1714]/65 p-4 backdrop-blur-sm sm:p-8">
    <div onClick={(event) => event.stopPropagation()} className="shop-fade-in relative my-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2">
      <button type="button" onClick={() => dispatch(closeDetail())} aria-label="Fechar detalhes" className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-main-regular shadow-md transition-colors hover:bg-[#fff0e5]"><FaTimes aria-hidden="true" /></button>
      <div className="flex min-h-[300px] items-center justify-center bg-[#f7f2ed] p-8 sm:p-12">
        {product.imageSrc ? <img src={product.imageSrc} alt={product.name} className="max-h-[430px] w-full object-contain" /> : <span className="text-main-medium">Imagem indisponível</span>}
      </div>
      <div className="flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14">
        <span className="shop-eyebrow">{product.category || 'Nishop'}</span>
        <h2 id="product-detail-title" className="mt-4 text-3xl font-bold leading-tight tracking-tight text-main-regular sm:text-4xl">{product.name}</h2>
        <p className="mt-5 text-base leading-7 text-main-medium">{product.description}</p>
        <p className="mt-8 text-2xl font-bold text-main-regular">{Number.isFinite(product.price) ? product.price.toLocaleString('pt-AO') : '—'} Kz</p>
        {Array.isArray(product.colors) && product.colors.length > 0 && <div className="mt-6 flex gap-2" aria-label="Cores disponíveis">
          {product.colors.filter((color): color is string => typeof color === 'string' && color.length > 0).map((color, index) => <span key={`${color}-${index}`} className="h-6 w-6 rounded-full border border-[#eee6de]" style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }} />)}
        </div>}
        <button type="button" onClick={addToCart} className="shop-button shop-button-primary mt-9 w-full sm:w-fit">Adicionar ao carrinho</button>
      </div>
    </div>
  </div>;
}
