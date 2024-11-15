import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { preloadTools } from './preload'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

// 预加载数据
preloadTools()

export const metadata: Metadata = {
  title: "Next.js App",
  description: "Created with Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}