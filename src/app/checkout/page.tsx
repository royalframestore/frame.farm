"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useBuyNowStore } from "@/store/buyNowStore";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useUserStore();
  const { items: cartItems, clearCart } = useCartStore();
  const { product: buyNowProduct, quantity: buyNowQty, clear: clearBuyNow } = useBuyNowStore();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const [formData, setFormData] = useState({
    name: profile?.full_name || "",
    email: profile?.email || "",
    mobile: profile?.mobile || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const checkoutItems = buyNowProduct 
    ? [{ ...buyNowProduct, productId: buyNowProduct.id, quantity: buyNowQty, discountedPrice: typeof buyNowProduct.price === 'string' ? parseInt(buyNowProduct.price.replace(/[^\d]/g, "")) : buyNowProduct.price }]
    : cartItems;

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  useEffect(() => {
    const isGuest = localStorage.getItem("guest_checkout") === "true";
    if (!user && !isGuest) {
      router.push("/");
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      // 1. Create order on server
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100 }), // amount in paise
      });

      const orderData = await orderRes.json();
      if (orderData.error) throw new Error(orderData.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Frame. Farm",
        description: `Order for ${checkoutItems.length} items`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setVerifying(true);
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                user_id: user?.id || null,
                customer_name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                address_line: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark,
                product_id: checkoutItems[0].productId, // Simplified for now
                product_name: checkoutItems[0].name,
                quantity: checkoutItems[0].quantity,
                original_price: checkoutItems[0].originalPrice || checkoutItems[0].discountedPrice,
                discounted_price: checkoutItems[0].discountedPrice,
                discount_percent: checkoutItems[0].discountPercent || 0,
                total: total,
              },
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSuccess(true);
            setOrderRef(verifyData.orderRef);
            clearCart();
            clearBuyNow();
          } else {
            alert("Payment verification failed: " + verifyData.error);
          }
          setVerifying(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#b8922a",
        },
      };

      const rzp = (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-royal-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl text-center border border-royal-gold/10"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h1 className="font-barlow font-black text-[32px] uppercase tracking-tight text-royal-black mb-2">Order Confirmed</h1>
          <p className="font-cormorant italic text-royal-textMuted text-[18px] mb-8">
            Thank you for your purchase. Your museum-grade display is being prepared.
          </p>
          <div className="bg-royal-linen/30 p-4 rounded-xl mb-8">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-royal-muted mb-1">Order Reference</span>
            <span className="font-barlow font-black text-[20px] text-royal-gold">{orderRef}</span>
          </div>
          <Link 
            href="/"
            className="inline-block w-full bg-royal-black text-royal-cream py-4 rounded-[50px] font-barlow font-medium text-[13px] uppercase tracking-[2px]"
          >
            Return to Gallery
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-cream pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-royal-gold font-barlow font-bold text-[12px] uppercase tracking-widest mb-12 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <h1 className="font-barlow font-black text-[36px] uppercase tracking-tight text-royal-black mb-2">Checkout</h1>
            <p className="font-cormorant italic text-royal-textMuted text-[18px] mb-10">Complete your acquisition by providing delivery details.</p>

            <form onSubmit={handlePayment} className="space-y-8">
              <section>
                <h2 className="font-barlow font-bold text-[14px] uppercase tracking-widest text-royal-gold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-royal-gold flex items-center justify-center text-[12px]">01</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">Full Name</label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">Mobile Number</label>
                    <input 
                      type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">Email Address</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-barlow font-bold text-[14px] uppercase tracking-widest text-royal-gold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-royal-gold flex items-center justify-center text-[12px]">02</span>
                  Delivery Destination
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">Street Address</label>
                    <input 
                      type="text" name="address" value={formData.address} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">City</label>
                    <input 
                      type="text" name="city" value={formData.city} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">State</label>
                    <input 
                      type="text" name="state" value={formData.state} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">Pincode</label>
                    <input 
                      type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-royal-muted ml-1">Landmark (Optional)</label>
                    <input 
                      type="text" name="landmark" value={formData.landmark} onChange={handleInputChange}
                      className="w-full bg-white border border-royal-black/10 rounded-xl px-5 py-4 font-barlow text-[14px] focus:outline-none focus:border-royal-gold transition-colors"
                    />
                  </div>
                </div>
              </section>

              <button 
                type="submit" disabled={loading || verifying}
                className="w-full bg-royal-black text-royal-cream py-6 rounded-[50px] font-barlow font-bold text-[14px] uppercase tracking-[3px] flex items-center justify-center gap-4 hover:bg-royal-gold transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : verifying ? "Verifying Payment..." : (
                  <>
                    <CreditCard size={20} />
                    Complete Acquisition — ₹{total.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-royal-gold/10 sticky top-24">
              <h2 className="font-barlow font-bold text-[14px] uppercase tracking-widest text-royal-black mb-8">Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {checkoutItems.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="relative w-20 aspect-[4/5] bg-royal-linen rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow py-1">
                      <h3 className="font-barlow font-bold text-[13px] uppercase tracking-wide">{item.name}</h3>
                      <p className="font-barlow text-[12px] text-royal-textMuted mb-2">Quantity: {item.quantity}</p>
                      <p className="font-barlow font-bold text-[14px] text-royal-gold">₹{(item.discountedPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-royal-gold/10 pt-6">
                <div className="flex justify-between text-[13px] font-barlow text-royal-textMuted">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px] font-barlow text-royal-textMuted">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between items-end border-t border-royal-gold/10 pt-6">
                  <span className="font-barlow font-bold text-[14px] uppercase tracking-widest text-royal-black">Total Acquisition</span>
                  <span className="font-barlow font-black text-[32px] text-royal-black leading-none">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-royal-linen/30 p-3 rounded-lg flex items-center gap-3">
                  <ShieldCheck size={20} className="text-royal-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Secure <br/> Payment</span>
                </div>
                <div className="bg-royal-linen/30 p-3 rounded-lg flex items-center gap-3">
                  <Truck size={20} className="text-royal-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Premium <br/> Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
