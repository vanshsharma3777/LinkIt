import { AnimatePresence , motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Share } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ShareOption = ({ url, title }: { url: string; title: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied! Now paste it anywhere.");
    setIsOpen(false);
  };

      const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard(); 
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-all rounded-lg ${isOpen ? 'text-orange-500 bg-orange-500/10' : 'text-gray-500 hover:text-orange-500 hover:bg-orange-500/10'}`}
      >
        <ExternalLink size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute right-0 top-10 w-44 bg-[#121826] border border-[#1f2937] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-1.5 flex flex-col gap-1">
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-black uppercase tracking-tighter text-orange-500 bg-orange-500/5 hover:bg-orange-500 hover:text-black rounded-lg transition-all"
              >
                <span className="shrink-0 text-sm">📤</span>
                <span>Send to Apps</span>
              </button>

              <div className="h-[1px] bg-[#1f2937] mx-2 my-1" />
              <a
                href={`https://wa.me/?text=${encodeURIComponent(title + ": " + url)}`}
                target="_blank"
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-black uppercase tracking-tighter text-gray-400 hover:bg-[#1f2937] hover:text-green-500 rounded-lg transition-all"
              >
                <span className="shrink-0 text-sm">📱</span>
                <span>WhatsApp</span>
              </a>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-black uppercase tracking-tighter text-gray-400 hover:bg-[#1f2937] hover:text-blue-400 rounded-lg transition-all text-left"
              >
                <span className="shrink-0 text-sm">📋</span>
                <span>Copy Link</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareOption