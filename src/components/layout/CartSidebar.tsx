"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartSidebar() {
  const router = useRouter();
  const { user } = useUserStore();
  const { setAuthModalOpen } = useAuth();
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity } = useCartStore();

  const cartTotal = items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      router.push("/checkout");
    }
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Sidebar */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-royal-cream h-full shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-royal-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-royal-gold" />
              <h2 className="font-barlow font-bold text-[18px] uppercase tracking-wider">Your Collection</h2>
              <span className="bg-royal-linen text-royal-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-royal-black hover:text-royal-gold transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <ShoppingBag size={48} strokeWidth={1} className="mb-4" />
                <p className="font-cormorant italic text-[18px]">Your collection is currently empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="flex gap-4 group">
                  <div className="relative w-24 aspect-[4/5] bg-royal-linen rounded-[4px] overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-barlow font-bold text-[13px] uppercase tracking-wide mb-1">{item.name}</h3>
                      <p className="font-barlow font-bold text-[14px] text-royal-gold">₹{item.discountedPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-royal-black/10 rounded-[50px] px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:text-royal-gold transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-barlow font-bold text-[12px]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:text-royal-gold transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-[10px] uppercase font-bold tracking-wider text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-royal-linen/30 border-t border-royal-gold/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-barlow font-medium text-[12px] uppercase tracking-widest text-royal-textMuted">Subtotal</span>
                <span className="font-barlow font-black text-[24px]">₹{cartTotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-royal-black text-royal-cream py-4 rounded-[50px] font-barlow font-medium text-[13px] uppercase tracking-[2px] flex items-center justify-center gap-3 group transition-all hover:bg-royal-gold"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[10px] text-royal-textMuted uppercase tracking-widest opacity-50">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
