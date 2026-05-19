import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-royal-cream border-t border-royal-gold/20 py-8">
      <div className="max-w-7xl mx-auto px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Message Button */}
        <button className="bg-royal-black text-royal-cream px-6 py-2.5 rounded-[50px] font-barlow font-medium text-[12px] flex items-center gap-3 transition-transform hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Any doubt? Message us
        </button>

        {/* Right Side: Tagline */}
        <div className="font-cormorant italic text-[16px] text-royal-muted">
          Crafted with precision. Delivered with care.
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-12 mt-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-royal-textMuted font-barlow opacity-50">
        <p>&copy; {new Date().getFullYear()} FRAME.FARM. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-royal-gold transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-royal-gold transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
