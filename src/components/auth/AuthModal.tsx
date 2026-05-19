"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, setAuthModalOpen } = useAuth();
  const { fetchProfile } = useUserStore();
  
  const [method, setMethod] = useState<"email" | "complete-profile">("email");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Auth States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isAuthModalOpen) {
      setMethod("email");
      setIsSignUp(false);
      setIsResetting(false);
      setError("");
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  }, [isAuthModalOpen]);



  // NOTE: Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set to real values in .env.local.

  const handleContinueAsGuest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_checkout", "true");
    }
    setAuthModalOpen(false);
    
    // Redirect to checkout if items exist
    const cartItems = useCartStore.getState().items;
    if (cartItems.length > 0) {
      router.push("/checkout");
    } else {
      router.push("/");
    }
  };

  const handleSandboxSignIn = () => {
    const { setMockUser } = useUserStore.getState();
    setMockUser();
    setAuthModalOpen(false);
    
    // Redirect to checkout if items exist
    const cartItems = useCartStore.getState().items;
    if (cartItems.length > 0) {
      router.push("/checkout");
    } else {
      router.push("/");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Directly attempt email auth with Supabase. Errors will be caught and displayed.

      if (!isSignUp) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Sign Up
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { 
              full_name: name 
            } 
          }
        });
        if (error) throw error;

        // If email confirmation is enabled, session won't be active yet
        if (data && !data.session) {
          setAuthModalOpen(false);
          router.push("/verify-email");
          return;
        }
      }
      setAuthModalOpen(false);
      
      // Redirect to checkout if items exist
      const cartItems = useCartStore.getState().items;
      if (cartItems.length > 0) {
        router.push("/checkout");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setError("Password reset link sent! Check your inbox.");
      setIsResetting(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name, email: email })
        .eq("id", user.id);

      if (error) throw error;
      await fetchProfile(user.id);
      setAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setAuthModalOpen(false)}
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-royal-cream rounded-2xl overflow-hidden shadow-2xl border border-royal-gold/10"
        >
          {/* Close Button */}
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-royal-black/40 hover:text-royal-black transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="font-barlow font-black text-[24px] uppercase tracking-tight text-royal-black">
                {method === "complete-profile" ? "Almost There" : "Join the Club"}
              </h2>
              <p className="font-cormorant italic text-royal-textMuted text-[15px]">
                {method === "complete-profile" ? "Tell us a bit more about yourself." : "Experience museum-grade excellence."}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-lg mb-6 font-barlow">
                {error}
              </div>
            )}

            {method === "email" ? (
              <div className="space-y-4">


                {/* Login / Sign Up Tabs */}
                {!isResetting && (
                  <div className="flex bg-royal-linen/30 p-1 rounded-[50px] mb-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsSignUp(false);
                        setError("");
                      }}
                      className={`flex-1 py-2 rounded-[50px] font-barlow font-bold text-[10px] uppercase tracking-wider transition-all ${!isSignUp ? 'bg-white text-royal-black shadow-sm' : 'text-royal-textMuted'}`}
                    >
                      Login
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsSignUp(true);
                        setError("");
                      }}
                      className={`flex-1 py-2 rounded-[50px] font-barlow font-bold text-[10px] uppercase tracking-wider transition-all ${isSignUp ? 'bg-white text-royal-black shadow-sm' : 'text-royal-textMuted'}`}
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {/* Email Form */}
                {isResetting ? (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required
                      className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-3.5 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-royal-black text-royal-cream font-barlow font-bold text-[13px] uppercase tracking-[1.5px] py-4 rounded-[50px] flex items-center justify-center gap-3 hover:bg-royal-gold transition-all mt-4 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsResetting(false);
                        setError("");
                      }}
                      className="w-full text-center text-[12px] font-barlow text-royal-textMuted hover:text-royal-black transition-colors"
                    >
                      Back to Login
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    {isSignUp && (
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                        className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-3.5 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                      />
                    )}
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required
                      className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-3.5 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                    <div className="space-y-1">
                      <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-3.5 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                      />
                      {!isSignUp && (
                        <div className="flex justify-end">
                          <button 
                            type="button" 
                            onClick={() => {
                              setIsResetting(true);
                              setError("");
                            }}
                            className="text-[11px] font-barlow font-medium text-royal-textMuted hover:text-royal-gold transition-colors mt-1"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-royal-black text-royal-cream font-barlow font-bold text-[13px] uppercase tracking-[1.5px] py-4 rounded-[50px] flex items-center justify-center gap-3 hover:bg-royal-gold transition-all mt-4 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : isSignUp ? "Create Account" : "Sign In"}
                    </button>
                  </form>
                )}

                {/* Sandbox Info & Bypass Mode */}
                {/* Sandbox UI removed – ensure real Supabase credentials are set in .env.local */}

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-royal-gold/10"></div>
                  <span className="flex-shrink mx-4 text-royal-textMuted/50 text-[10px] font-barlow uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t border-royal-gold/10"></div>
                </div>

                <button 
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="w-full bg-transparent border border-royal-black/20 text-royal-black font-barlow font-bold text-[13px] uppercase tracking-[1.5px] py-4 rounded-[50px] flex items-center justify-center gap-3 hover:bg-royal-black hover:text-royal-cream transition-all"
                >
                  Continue as Guest
                </button>
              </div>
            ) : (
              // Complete Profile Flow
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-3.5 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  className="w-full bg-royal-linen/50 border border-royal-gold/10 rounded-xl px-5 py-3.5 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-royal-black text-royal-cream font-barlow font-bold text-[13px] uppercase tracking-[1.5px] py-4 rounded-[50px] flex items-center justify-center gap-3 hover:bg-royal-gold transition-all mt-4 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Complete Profile"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
