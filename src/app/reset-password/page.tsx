"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-cream flex items-center justify-center p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl text-center border border-royal-gold/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-gold/20 via-royal-gold to-royal-gold/20" />

        <div className="w-20 h-20 bg-royal-linen/50 text-royal-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} strokeWidth={1.5} />
        </div>

        <h1 className="font-barlow font-black text-[32px] uppercase tracking-tight text-royal-black mb-2">
          {success ? "Password Updated" : "Reset Password"}
        </h1>
        
        <p className="font-cormorant italic text-royal-textMuted text-[18px] mb-8">
          {success 
            ? "Your password has been successfully changed." 
            : "Enter your new password below to secure your account."}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-lg mb-6 font-barlow text-left">
            {error}
          </div>
        )}

        {!success ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <input 
              type="password" 
              placeholder="New Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors text-left"
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-royal-black text-royal-cream py-4 rounded-[50px] font-barlow font-bold text-[13px] uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-royal-gold transition-all mt-4 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </button>
          </form>
        ) : (
          <Link 
            href="/"
            className="inline-flex w-full bg-royal-black text-royal-cream py-4 rounded-[50px] font-barlow font-medium text-[13px] uppercase tracking-[2px] items-center justify-center gap-3 hover:bg-royal-gold transition-all shadow-lg"
          >
            Return to Gallery <ArrowRight size={16} />
          </Link>
        )}
      </motion.div>
    </div>
  );
}
