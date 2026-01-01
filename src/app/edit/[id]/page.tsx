"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import Header from "../../../../components/ui/header"
import { PulseLoader } from "@/components/ui/loader"
import { useNav } from "@/lib/navigate"
import { motion } from "framer-motion"
import { 
  Link2, 
  Type, 
  AlignLeft, 
  Hash, 
  ArrowLeft, 
  Save 
} from "lucide-react"

interface Tag {
    id: string
    name: string
}

export default function EditLink() {
    const { id } = useParams<{ id: string }>()
    const { data: session, status } = useSession()
    const router = useRouter()
    const nav = useNav()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        tags: "",
    })

    useEffect(() => {
        const fetchLink = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`/api/link/update/${id}`)
                const link = res.data.doLinkExists
                
                if (!link) {
                    toast.error("Failed to load link")
                    router.replace("/dashboard")
                    return
                }

                setForm({
                    url: link.url,
                    title: link.title,
                    description: link.description || "",
                    tags: link.tags?.map((t: Tag) => t.name).join(", ") || "",
                })
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    nav("/signin")
                    return
                }
                toast.error("Link not found")
                router.replace("/dashboard")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchLink()
    }, [id, status])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        if (!form.url || !form.title) {
            toast.error("URL and Title are required")
            return
        }

        try {
            setSaving(true)
            await axios.put(`/api/link/update/${id}`, form)
            toast.success("Changes saved successfully ✨")
            router.push("/dashboard")
        } catch (error) {
            toast.error("Failed to update link")
        } finally {
            setSaving(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
                <PulseLoader />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0F1115] text-gray-200 pb-10">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-6 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#121826] border border-[#1f2937] rounded-2xl p-6 md:p-8 shadow-xl"
                >
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-100">Edit Link</h1>
                        <p className="text-sm text-gray-500 mt-1">Update your saved information below.</p>
                    </div>

                    <div className="space-y-6">
                        {/* URL Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Link2 size={14} className="text-orange-500" /> Web Address
                            </label>
                            <input
                                name="url"
                                value={form.url}
                                onChange={handleChange}
                                placeholder="https://example.com"
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
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g., Portfolio Site"
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
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Add some context about this link..."
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
                                value={form.tags}
                                onChange={handleChange}
                                placeholder="tag1, tag2, tag3"
                                className="w-full rounded-xl bg-[#0F1115] px-4 py-3 text-gray-300 text-sm border border-[#1f2937] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                            />
                            <p className="text-[10px] text-gray-600 italic">Separate tags with commas</p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpdate}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-60 transition-colors shadow-lg shadow-orange-500/10"
                        >
                            {saving ? (
                                <>
                                 <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}