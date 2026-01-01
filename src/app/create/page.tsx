"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { 
  Link2, 
  Type, 
  AlignLeft, 
  Hash, 
  ArrowLeft, 
  PlusCircle 
} from "lucide-react"

import Header from "../../../components/ui/header"
import { PulseLoader } from "../../../components/ui/loader"
import { useNav } from "@/lib/navigate"

export default function CreateLinkPage() {
  const { data: session, status } = useSession()
  const nav = useNav()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      nav("/signin")
    }
  }, [status, nav])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.url || !form.title) {
      toast.error("URL and Title are required")
      return
    }
    try {
      setLoading(true)
      await axios.post("/api/link/create", { ...form })
      toast.success("Link created successfully 🚀")
      router.replace("/dashboard")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create link")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
        <PulseLoader />
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="min-h-screen bg-[#0F1115] text-gray-200 pb-12">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Cancel</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121826] border border-[#1f2937] rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-100">Create New Link</h1>
            <p className="text-sm text-gray-500 mt-1">Save a new resource to your collection.</p>
          </div>

          <div className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Link2 size={14} className="text-orange-500" /> URL / Link
              </label>
              <input
                name="url"
                placeholder="https://example.com"
                value={form.url}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#0F1115] px-4 py-3 text-gray-300 text-sm border border-[#1f2937] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Type size={14} className="text-orange-500" /> Title
              </label>
              <input
                name="title"
                placeholder="Title (e.g. Developer Roadmap)"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#0F1115] px-4 py-3 text-gray-300 text-sm border border-[#1f2937] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <AlignLeft size={14} className="text-orange-500" /> Description
              </label>
              <textarea
                name="description"
                placeholder="Why are you saving this link?"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#0F1115] px-4 py-3 text-gray-300 text-sm border border-[#1f2937] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none transition-all"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Hash size={14} className="text-orange-500" /> Tags
              </label>
              <input
                name="tags"
                placeholder="Separate tags with commas (e.g. Design, UI, Free)"
                value={form.tags}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#0F1115] px-4 py-3 text-gray-300 text-sm border border-[#1f2937] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-60 transition-colors shadow-lg shadow-orange-500/10"
              >
                {loading ? (
                  <>
                    <span>Creating Link...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Confirm & Create Link</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}