"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useBuyNowStore } from "@/store/buyNowStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { setAuthModalOpen } = useAuth();
  const { user } = useUserStore();
  const { addItem } = useCartStore();
  const { setBuyNow } = useBuyNowStore();

  const handleAction = async (action: string, item: any) => {
    if (action === "cart") {
      await addItem(item);
    } else if (action === "buy") {
      setBuyNow(item, 1);
      if (!user) {
        setAuthModalOpen(true);
      } else {
        router.push("/checkout");
      }
    }
  };

  const products = [
    {
      id: 1,
      name: "GT-R Heritage Frame",
      image: "/images/countachlambo.webp",
      originalPrice: 1800,
      price: 899,
      sale: true
    },
    {
      id: 2,
      name: "Classic Speedster Edition",
      image: "/images/gordonmurraygrey.webp",
      originalPrice: 1600,
      price: 1045,
      sale: true
    },
    {
      id: 3,
      name: "Motorsport Collection",
      image: "/images/unnamed-61-2.webp",
      originalPrice: 2200,
      price: 1199,
      sale: true
    },
    {
      id: 4,
      name: "Limited Aero Display",
      image: "/images/countachlambo.webp",
      originalPrice: 1500,
      price: 999,
      sale: true
    }
  ];

  const reviews = [
    { name: "Amit Shah", text: "The quality of the frame is museum-grade. It transformed my office space completely." },
    { name: "Rajesh Kumawat", text: "Precision engineering at its best. The carbon fiber finish is absolutely stunning." },
    { name: "Harsh Jain", text: "Finally, a way to display my collectibles that matches their value. Highly recommended." },
    { name: "Shivam Singh", text: "Excellent customer service and even better products. A must-have for every petrolhead." }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-royal-cream scroll-smooth">
      {/* Hero Section */}
      <section id="hero" className="relative w-full flex flex-col items-center justify-start pt-8 md:pt-12 pb-4 md:pb-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-barlow font-black text-[150px] md:text-[280px] text-black/[0.02] select-none pointer-events-none z-0">
          FF
        </div>

        <div className="relative z-10 text-center flex flex-col items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-6 md:w-8 h-[1px] bg-royal-gold" />
            <span className="font-cormorant italic text-royal-gold text-base md:text-lg">The Signature Collection</span>
            <div className="w-6 md:w-8 h-[1px] bg-royal-gold" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-barlow font-black text-[40px] md:text-[68px] leading-tight tracking-[-1px] md:tracking-[-2px] mb-6"
          >
            <span className="text-royal-black">Engineering</span><br />
            <span className="text-royal-muted relative inline-block">
              Visual Perfection.
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-royal-gold to-transparent" />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-cormorant italic text-[14px] md:text-[16px] text-royal-textMuted max-w-lg mx-auto mb-10 leading-relaxed"
          >
            Meticulously crafted displays for your most prized automotive collectibles. Where heritage meets engineering.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center"
          >
            <Link 
              href="#collection" 
              className="w-full sm:w-auto bg-royal-black text-royal-cream px-10 py-4 rounded-[50px] font-barlow font-medium text-[13px] tracking-wider text-center"
            >
              Explore Collection →
            </Link>
            <Link 
              href="#bespoke" 
              className="w-full sm:w-auto bg-transparent border border-royal-black text-royal-black px-10 py-4 rounded-[50px] font-barlow font-medium text-[13px] tracking-wider text-center"
            >
              Bespoke Orders
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="scroll-mt-24 py-8 px-6 md:px-12">
        <div className="w-full flex items-center justify-center mb-16">
          <div className="flex-grow h-[1px] gold-gradient-rule opacity-30" />
          <div className="px-10 flex items-center gap-4">
            <div className="w-6 h-[1px] bg-royal-gold" />
            <span className="font-cormorant italic text-royal-gold text-[18px]">Featured Pieces</span>
            <div className="w-6 h-[1px] bg-royal-gold" />
          </div>
          <div className="flex-grow h-[1px] gold-gradient-rule opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((item) => (
            <div key={item.id} className="group flex flex-col">
              <div className="aspect-[4/5] bg-royal-linen rounded-[6px] mb-6 flex items-center justify-center relative p-8">
                {item.sale && (
                  <div className="absolute top-4 left-4 bg-royal-gold text-white font-barlow font-bold text-[9px] uppercase tracking-[1.5px] px-2.5 py-1 rounded-[2px] z-20">
                    Sale
                  </div>
                )}
                <div className="relative w-full h-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-500 rounded-sm overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="font-barlow font-bold text-[13px] uppercase tracking-wider text-royal-black mb-2">{item.name}</h3>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-barlow font-light text-[13px] text-royal-textMuted line-through">₹{item.originalPrice.toLocaleString()}</span>
                  <span className="font-barlow font-bold text-[15px] text-royal-black">₹{item.price.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => handleAction("cart", item)}
                  className="w-full bg-transparent border border-royal-black/20 py-3 rounded-[50px] font-barlow font-medium text-[11px] uppercase tracking-[1.5px] text-royal-black hover:bg-royal-black hover:text-royal-cream transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Section */}
      <section id="heritage" className="scroll-mt-24 py-24 bg-royal-linen/30 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-cormorant italic text-royal-gold text-[18px] mb-6 block">Our Heritage</span>
          <h2 className="font-barlow font-black text-[32px] md:text-[48px] text-royal-black mb-8 uppercase tracking-tight">Built on Precision.</h2>
          <p className="font-cormorant italic text-[18px] md:text-[20px] text-royal-textMuted leading-relaxed">
            Founded in 1988, Frame.Farm was born out of a single obsession: to create a display medium worthy of the engineering marvels it holds. Our frames are not just glass and metal; they are precision-calibrated environments designed to preserve and celebrate automotive history.
          </p>
        </div>
      </section>

      {/* Bespoke Section */}
      <section id="bespoke" className="scroll-mt-24 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-royal-linen aspect-video rounded-[6px] relative overflow-hidden">
             <Image src="/images/gordonmurraygrey.webp" alt="Bespoke" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
          <div>
            <span className="font-cormorant italic text-royal-gold text-[18px] mb-6 block">Bespoke Orders</span>
            <h2 className="font-barlow font-black text-[32px] md:text-[48px] text-royal-black mb-6 uppercase tracking-tight">Your Vision. <br/> Our Engineering.</h2>
            <p className="font-cormorant italic text-[18px] text-royal-textMuted mb-8 leading-relaxed">
              Every collection is unique. Our bespoke service allows you to customize materials, dimensions, and lighting to match the specific heritage of your collection. From Alcantara-lined bases to integrated LED shadow-mapping.
            </p>
            <button className="bg-royal-black text-royal-cream px-10 py-4 rounded-[50px] font-barlow font-medium text-[13px] tracking-wider">
              Start Your Project
            </button>
          </div>
        </div>
      </section>

      {/* Journal Section (Reviews) */}
      <section id="journal" className="scroll-mt-24 py-24 bg-royal-black text-royal-cream px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-cormorant italic text-royal-gold text-[18px] mb-4 block">The Journal</span>
            <h2 className="font-barlow font-black text-[32px] md:text-[48px] uppercase tracking-tight">Voices of Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="border border-white/10 p-8 rounded-[6px] flex flex-col justify-between hover:border-royal-gold/50 transition-colors">
                <p className="font-cormorant italic text-[18px] text-royal-muted mb-8 leading-relaxed">
                  "{review.text}"
                </p>
                <div>
                  <div className="w-8 h-[1px] bg-royal-gold mb-4" />
                  <span className="font-barlow font-bold text-[12px] uppercase tracking-[2px]">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
