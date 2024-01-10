import type { Metadata } from 'next'
import React from 'react'
import { Providers } from '@/lib/providers'
import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import NewsLetters from '../components/NewsLetters'
import localFont from 'next/font/local'
import Details from '../components/Details'
import Notification from "@/app/components/Notification"
import Cart from '../components/Cart'
import Notifications from '../components/Notifications'
import ShoppingBag from '../components/ShoppingBag'

export const metadata: Metadata = {
  title: 'N I S H O P',
}

interface iRootLayout {
  children: React.ReactNode
}

const poppins = localFont({ src: '../fonts/Poppins-Regular.ttf' })

export default function RootLayout({ children }: iRootLayout) {
  return (
    <Providers>
      <html lang="pt">
        <body>
          <div className={poppins.className + " relative flex flex-col w-full h-auto min-h-screen"}>
            <Notifications />
            <Header />
            {children}
            <NewsLetters />
            <Footer />
            <Cart />
            <Details />
            <ShoppingBag />
          </div>
        </body>
      </html>
    </Providers>
  )
}