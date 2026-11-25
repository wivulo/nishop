"use client";
import { NextPage } from 'next';
import Products from './products';
import { getProducts } from '@/app/(shop)/getProducts';
import { useQuery } from '@tanstack/react-query';
import { ProductListSkelton } from '@/app/components/ProductListSkelton';


const ProductsPage: NextPage = () => {
    const {data, isPending} = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    return (
        <main className='min-h-screen w-full'>
            {
                isPending ?
                (
                    <div className="shop-shell py-12"><ProductListSkelton /></div>
                )
                :
                (<div className='w-full'>
                    {
                        data && data.length > 0 ?
                            <Products products={data} />
                            :
                            (<div className='shop-shell grid min-h-[50vh] place-content-center text-center'>
                                <p className='text-2xl font-semibold text-main-regular'>Ainda não há produtos disponíveis.</p>
                            </div>)
                    }
                </div>)
            }
        </main>
    );
};

export default ProductsPage;
