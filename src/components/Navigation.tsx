'use client';

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </motion.button>

          <ul className="hidden lg:flex space-x-8">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link href="/experiences" className="hover:text-blue-600 transition-colors">Experiences</Link></li>
            <li><Link href="/projects" className="hover:text-blue-600 transition-colors">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            <li><Link href="/wordle" className="hover:text-gray-300 transition-colors">Wordle</Link></li>
          </ul>
          <ThemeToggle />
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
            >
              <ul className="pt-4 pb-2 space-y-4">
                <li><Link href="/" onClick={handleLinkClick} className="block hover:text-blue-600 transition-colors">Home</Link></li>
                <li><Link href="/experiences" onClick={handleLinkClick} className="block hover:text-blue-600 transition-colors">Experiences</Link></li>
                <li><Link href="/projects" onClick={handleLinkClick} className="block hover:text-blue-600 transition-colors">Projects</Link></li>
                <li><Link href="/contact" onClick={handleLinkClick} className="block hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link href="/wordle" onClick={handleLinkClick} className="block hover:text-gray-300 transition-colors">Wordle</Link></li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
} 