import type { Metadata } from 'next'
import React from 'react'
import { Providers } from '@/lib/providers'
import '../styles/globals.css'
import localFont from 'next/font/local'
import Notifications from '../components/Notifications'

export const metadata: Metadata = {
  title: 'administrator',
}

interface iAdminLayout {
  children: React.ReactNode
}

const poppins = localFont({ src: '../fonts/Poppins-Regular.ttf' })

export default function AdminLayout({ children }: iAdminLayout) {
  return (
    <Providers>
      <html lang="pt">
        <body>
          <div className={poppins.className + " relative flex min-h-screen w-full"}>
            <Notifications />
            {children}
          </div>
        </body>
      </html>
    </Providers>
  )
}
