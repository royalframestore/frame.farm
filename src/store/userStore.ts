import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserState {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  setMockUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout failed (expected if keys are placeholders):", e);
    }
    set({ user: null, session: null, profile: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("guest_checkout");
    }
  },
  setMockUser: () => {
    const mockUser = {
      id: 'dev-sandbox-user-id',
      email: 'sandbox@frame.farm',
      role: 'authenticated',
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: { full_name: 'Developer Sandbox' }
    } as any;
    set({
      user: mockUser,
      session: {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: mockUser
      },
      profile: {
        id: 'dev-sandbox-user-id',
        full_name: 'Developer Sandbox',
        email: 'sandbox@frame.farm',
        mobile: '+91 8104992465'
      },
      loading: false
    });
  }
}));
