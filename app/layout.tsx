import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Claude Tasks',
  description: 'A feature concept prototype exploring AI-native task management inside Claude.',
  openGraph: {
    title: 'Claude Tasks',
    description: 'A feature concept prototype exploring AI-native task management inside Claude.',
    images: [{ url: '/og-image.png', width: 2640, height: 1712 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Tasks',
    description: 'A feature concept prototype exploring AI-native task management inside Claude.',
    images: ['/og-image.png'],
  },
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
