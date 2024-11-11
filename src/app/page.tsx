'use client';

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import Image from 'next/image';
import NowPlaying from '@/components/NowPlaying';
import FortniteStats from '@/components/FortniteStats';

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative py-20">
      <AnimatedSection className="container mx-auto px-4 text-center">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-64 h-64 md:w-80 md:h-80"
          >
            <Image
              src="/IMG_2056.png"
              alt="Krish Vijayvergia"
              fill
              className="rounded-full object-cover shadow-xl"
              priority
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="flex flex-col items-center md:items-start gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Hi, I&apos;m{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Krish
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-6 text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Software Engineer | Runner | Student
            </motion.p>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <a 
                href="https://www.linkedin.com/in/krish-vijayvergia-33b54928b/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors"
              >
                GitHub
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Now Playing and Fortnite Stats Section */}
        <motion.div
          className="mt-12 flex flex-col md:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <NowPlaying />
          <FortniteStats />
        </motion.div>
      </AnimatedSection>
    </section>
  );
}
