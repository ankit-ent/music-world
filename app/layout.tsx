import type { Metadata } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
});
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Music Space",
  description: "A visual and musical experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full">
      <body className={`${inter.className} ${caveat.variable} ${playfair.variable} overflow-auto`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
