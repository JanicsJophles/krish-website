'use client';

import { FaLinkedin, FaGithub, FaStrava } from 'react-icons/fa';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/feed/',
    icon: FaLinkedin,
    color: 'hover:text-[#0077B5] dark:hover:text-[#0077B5]'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: FaGithub,
    color: 'hover:text-[#333] dark:hover:text-white'
  },
  {
    name: 'Strava',
    url: 'https://www.strava.com/athletes/86482587',
    icon: FaStrava,
    color: 'hover:text-[#FC4C02] dark:hover:text-[#FC4C02]'
  }
];

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-600 dark:text-gray-400 ${link.color} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon size={24} />
              <span className="sr-only">{link.name}</span>
            </motion.a>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          © {new Date().getFullYear()} Krish Vijayvergia. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 