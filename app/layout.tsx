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
  title: "Wavy Lines",
  description: "For some spacey music",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }
      // { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full">
      <body className={`${inter.className} ${caveat.variable} ${notoSerif.variable} overflow-auto`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
