import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Claude To Do',
  description: 'A Claude-powered task management prototype',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
