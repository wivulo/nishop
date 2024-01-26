import type { Metadata } from 'next'
import React from 'react'
import { Providers } from '@/lib/providers'
import '../styles/globals.css'
import localFont from 'next/font/local'
import Notifications from '../components/Notifications'
import Loading from '../components/Loading'

export const metadata: Metadata = {
  title: 'Login',
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
          <div className={poppins.className + " relative flex w-screen h-screen"}>
            <Notifications />
            {/* <Loading /> */}
            {children}
          </div>
        </body>
      </html>
    </Providers>
  )
}