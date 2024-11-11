import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krish Vijayvergia",
  description: "Personal portfolio of Krish Vijayvergia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `
        }} />
      </head>
      <body className={`${inter.className} transition-colors duration-200`}>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
          <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="w-10" /> {/* Spacer for centering */}
                <ul className="flex space-x-8">
                  <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                  <li><Link href="/experiences" className="hover:text-blue-600 transition-colors">Experiences</Link></li>
                  <li><Link href="/projects" className="hover:text-blue-600 transition-colors">Projects</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                  <li><Link href="/wordle" className="hover:text-gray-300 transition-colors">Wordle</Link></li>
                </ul>
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
