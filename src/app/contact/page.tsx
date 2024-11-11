'use client';

import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="min-h-screen py-20">
      <AnimatedSection className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Get in Touch
            </span>
          </h2>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your message..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2
                ${status === 'sending' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPaperPlane className={status === 'sending' ? 'animate-bounce' : ''} />
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </motion.button>

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-center"
              >
                Message sent successfully!
              </motion.p>
            )}

            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center"
              >
                Failed to send message. Please try again.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </AnimatedSection>
    </section>
  );
} 