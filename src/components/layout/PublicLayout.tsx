import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export function PublicLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen w-full flex-col bg-canvas">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <PublicHeader />
      <motion.main id="main" key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="flex-1">
        <Outlet />
      </motion.main>
      <Footer />
    </div>);

}