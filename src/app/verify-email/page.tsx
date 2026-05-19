"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-royal-cream flex items-center justify-center p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl text-center border border-royal-gold/10 relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-gold/20 via-royal-gold to-royal-gold/20" />

        <div className="w-24 h-24 bg-royal-linen/50 text-royal-gold rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Mail size={40} strokeWidth={1.5} />
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-royal-gold/20 rounded-full"
          />
        </div>

        <h1 className="font-barlow font-black text-[32px] uppercase tracking-tight text-royal-black mb-4">
          Verify Your Mail
        </h1>
        
        <p className="font-cormorant italic text-royal-textMuted text-[18px] mb-8 leading-relaxed">
          We've sent a secure verification link to your email address. Please check your inbox to activate your museum-grade experience.
        </p>

        <div className="bg-royal-linen/30 p-5 rounded-xl mb-8 border border-royal-gold/5">
          <p className="font-barlow text-[13px] text-royal-black/60 tracking-wide uppercase font-medium">
            Didn't receive the email?
          </p>
          <p className="font-barlow text-[12px] text-royal-textMuted mt-1">
            Check your spam folder or wait a few minutes.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-flex w-full bg-royal-black text-royal-cream py-4 rounded-[50px] font-barlow font-medium text-[13px] uppercase tracking-[2px] items-center justify-center gap-3 hover:bg-royal-gold transition-all"
        >
          Return to Gallery <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}
