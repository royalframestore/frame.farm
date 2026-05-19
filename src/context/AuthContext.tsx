"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { mergeGuestCart } from "@/lib/cartMerge";

interface AuthContextType {
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthModalOpen: false,
  setAuthModalOpen: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, fetchProfile, setProfile } = useUserStore();
  const { syncFromSupabase, clearCart } = useCartStore();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        syncFromSupabase();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        if (event === 'SIGNED_IN') {
          await mergeGuestCart(session.user.id);
        }
        await fetchProfile(session.user.id);
        await syncFromSupabase();
      } else {
        setProfile(null);
        if (event === 'SIGNED_OUT') {
          clearCart();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthModalOpen, setAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
