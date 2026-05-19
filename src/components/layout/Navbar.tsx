"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setAuthModalOpen } = useAuth();
  const { user, signOut } = useUserStore();
  const { items, setIsCartOpen } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Collection", "Heritage", "Bespoke", "Journal"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-royal-cream/95 backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20 md:h-24 relative">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-royal-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/">
          <div className="font-barlow font-extrabold text-[18px] md:text-[22px] uppercase tracking-[3px] md:tracking-[3.5px] text-royal-black">
            FRAME<span className="text-royal-gold">.FARM</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <Link 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="font-barlow font-medium text-[11px] uppercase tracking-[2.5px] text-royal-textMuted hover:text-royal-gold transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          {user ? (
            <button onClick={signOut} className="text-royal-textMuted hover:text-royal-gold transition-colors duration-300">
              <LogOut size={18} strokeWidth={1.5} />
            </button>
          ) : (
            <button onClick={() => setAuthModalOpen(true)} className="text-royal-textMuted hover:text-royal-gold transition-colors duration-300">
              <User size={18} strokeWidth={1.5} />
            </button>
          )}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-royal-textMuted hover:text-royal-gold transition-colors duration-300 relative"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-royal-gold text-white text-[9px] font-barlow font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {items.length}
            </span>
          </button>
        </div>

        {/* Gold Gradient Bottom Border */}
        <div className="absolute bottom-0 left-6 md:left-12 right-6 md:right-12 h-[1px] gold-gradient-rule opacity-50" />
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-royal-cream border-t border-royal-gold/10 p-8 flex flex-col gap-6 md:hidden shadow-xl"
          >
            {navLinks.map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="font-barlow font-medium text-[14px] uppercase tracking-[3px] text-royal-black"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
