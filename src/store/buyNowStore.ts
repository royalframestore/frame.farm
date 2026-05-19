import { create } from 'zustand';

interface BuyNowStore {
  product: any | null;
  quantity: number;
  setBuyNow: (product: any, quantity: number) => void;
  clear: () => void;
}

export const useBuyNowStore = create<BuyNowStore>((set) => ({
  product: null,
  quantity: 1,
  setBuyNow: (product, quantity) => set({ product, quantity }),
  clear: () => set({ product: null, quantity: 1 }),
}));
