import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_KR } from "next/font/google";

const noto_sans = Noto_Sans_KR({
  variable: "--font-noto",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "yeop.in",
  description: "어쩌다 이런 누추한 곳에 들리게 되셨습니까?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={noto_sans.variable}>
      <body>
        <nav className="navigator">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/writings">Writings</Link>
            </li>
          </ul>
        </nav>
        {children}
        <footer>
          <p>&copy; Copyright {new Date().getFullYear()} Jeong</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
