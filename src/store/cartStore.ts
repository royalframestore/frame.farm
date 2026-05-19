import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './userStore';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  discountedPrice: number;
  originalPrice: number;
  discountPercent: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  syncFromSupabase: () => Promise<void>;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('rfs_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('rfs_session_id', sessionId);
  }
  return sessionId;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  loading: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  
  addItem: async (product, quantity = 1) => {
    const { user } = useUserStore.getState();
    const sessionId = getOrCreateSessionId();
    const existing = get().items.find(i => i.productId === product.id);

    if (existing) {
      const newQty = existing.quantity + quantity;
      const query = supabase.from('cart_items').update({ quantity: newQty }).eq('product_id', product.id);
      const { error } = await (user ? query.eq('user_id', user.id) : query.eq('session_id', sessionId));
      if (error) console.error('Cart update error:', error);

      set(state => ({
        items: state.items.map(i => i.productId === product.id ? { ...i, quantity: newQty } : i)
      }));
    } else {
      const { error } = await supabase.from('cart_items').insert({
        product_id: product.id,
        quantity,
        user_id: user?.id ?? null,
        session_id: user ? null : sessionId,
      });
      if (error) console.error('Cart insert error:', error);

      set(state => ({
        items: [...state.items, {
          id: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          image: product.image || (product.images && product.images[0]) || '',
          discountedPrice: product.discounted_price || product.price,
          originalPrice: product.original_price || product.price,
          discountPercent: product.discount_percent || 0,
          quantity,
        }]
      }));
    }
    set({ isCartOpen: true });
  },

  removeItem: async (productId) => {
    const { user } = useUserStore.getState();
    const sessionId = getOrCreateSessionId();
    const query = supabase.from('cart_items').delete().eq('product_id', productId);
    const { error } = await (user ? query.eq('user_id', user.id) : query.eq('session_id', sessionId));
    if (error) console.error('Cart delete error:', error);

    set(state => ({ items: state.items.filter(i => i.productId !== productId) }));
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    const { user } = useUserStore.getState();
    const sessionId = getOrCreateSessionId();
    const query = supabase.from('cart_items').update({ quantity }).eq('product_id', productId);
    const { error } = await (user ? query.eq('user_id', user.id) : query.eq('session_id', sessionId));
    if (error) console.error('Cart qty update error:', error);

    set(state => ({
      items: state.items.map(i => i.productId === productId ? { ...i, quantity } : i)
    }));
  },

  clearCart: () => set({ items: [] }),

  syncFromSupabase: async () => {
    const { user } = useUserStore.getState();
    const sessionId = localStorage.getItem('rfs_session_id');
    if (!user && !sessionId) return;

    set({ loading: true });
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq(user ? 'user_id' : 'session_id', user ? user.id : sessionId);

    if (error) {
      console.error('Cart sync error:', error);
    } else {
      set({
        items: (data ?? []).map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.products.name,
          image: item.products.images[0],
          discountedPrice: item.products.discounted_price,
          originalPrice: item.products.original_price,
          discountPercent: item.products.discount_percent,
          quantity: item.quantity,
        }))
      });
    }
    set({ loading: false });
  },
}));
