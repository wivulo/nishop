"use client"
import React, { useReducer } from 'react';
import data from "@/app/data/data.json";
import { iProduct } from '@/app/models/iProduct';
import { addProduct } from '@/lib/redux/Cart/cartSlice';
import { addProductToDB } from './server';
import { Product } from '@prisma/client';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { useDispatch } from 'react-redux';
import { ERequestState } from '@/app/models/eRequestState';

export default function AdminPage() {
    const dispatch = useDispatch();

    const handleAddProductIntoDB = async (product: iProduct) => {
        if(await addProductToDB(product)){
            dispatch( showNotification({
                message: "Product added successfully",
                type: ERequestState.success
            }) )
        }else{
            dispatch( showNotification({
                message: "Error to add Product",
                type: ERequestState.error
            }) )
        }
    }

    return (
        <main className="w-full min-h-screen relative">
            <div className='min-h-screen w-full'>
                <h1>Admin Page</h1>

                <div className='grid place-content-center'>
                    <ul className='w-1/2 h-full flex flex-col gap-3'>
                        {data.products.map(prod => (
                            <li key={prod.name} onClick={() => handleAddProductIntoDB(prod)}>
                                <p>{prod.description}</p>
                                <p>{prod.category}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    )
}
