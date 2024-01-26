"use client";

import React, { HTMLAttributes, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import {detailAnimations} from "@/app/components/Loading/animation"
import { useQueryState } from 'nuqs';
import { iLoading } from './iLoading';



const Loading: React.FC<iLoading> = ({ isPedding }) => {
    // const [isLoading, setIsLoading] = useQueryState("isloading")

    const dispatch = useDispatch();
    const loadingRef = useRef<HTMLDivElement>(null);


    const loading = loadingRef.current;

    useEffect(() => {
        if (isPedding != null)
            loading && detailAnimations.fadeIndAnimation(loading)
        else
            detailAnimations.fadeOutAnimation(loading)

    }, [isPedding]);

    return (
        <div ref={loadingRef} className={`${isPedding ? "grid" : "hidden"} place-content-center w-screen h-screen fixed left-0 top-0 bg-base-graybackground/40 z-50 overflow-hidden`}>
            <p className='text-4xl text-text-2 font-semibold'>Loading.....</p>
        </div>
    );
};

export default Loading;
