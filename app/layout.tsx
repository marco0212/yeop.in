import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import type { Metadata } from "next";
import { Grandstander } from "next/font/google";
import { PropsWithChildren } from "react";
import { Gnb } from "@components";

const font = Grandstander({
  variable: "--grandstander",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "yeop.in",
  description: "소프트웨어 개발자 정인엽의 다용도 블로그",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className={font.variable}>
      <body>
        <Gnb />
        <main>{children}</main>
        <footer className="container mt-14 py-5">
          <p className="text-center">
            &copy; Copyright {new Date().getFullYear()} Jeong
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
