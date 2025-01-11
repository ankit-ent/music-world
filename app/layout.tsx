import type { Metadata } from "next";
import { Inter, Caveat, Noto_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
});
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wavylines.in'),
  title: "Wavy Lines",
  description: "For some spacey music",
  keywords: ['music', 'space music', 'ambient', 'electronic music', 'wavy lines', 'music streaming'],
  authors: [{ name: 'Wavy Lines' }],
  creator: 'Wavy Lines',
  publisher: 'Wavy Lines',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wavylines.in',
    title: 'Wavy Lines',
    description: 'For some spacey music',
    siteName: 'Wavy Lines',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Wavy Lines Preview'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wavy Lines',
    description: 'For some spacey music',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code', // Add your verification code when ready
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#1c1917'
      }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Wavy Lines'
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full" lang="en">
      <head>
        <link rel="canonical" href="https://wavylines.in" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="40b0b6f3-2faa-46fb-8c23-64f597f0414b"></script>
      </head>
      <body className={`${inter.className} ${caveat.variable} ${notoSerif.variable} overflow-auto`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
