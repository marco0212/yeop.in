import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

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
    <html lang="ko">
      <body>
        <nav className="navigator">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
        {children}
        <footer>
          <p>&copy; Copyright {new Date().getFullYear()} Jeong</p>
        </footer>
      </body>
    </html>
  );
}
