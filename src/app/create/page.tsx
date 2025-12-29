"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { PulseLoader } from "../../../components/ui/loader"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Header from "../../../components/ui/header"
import { useNav } from "@/lib/navigate"

export default function CreateLinkPage() {
  const { data: session , status } = useSession()
  const nav = useNav()
  useEffect(() => {
  if (status === "unauthenticated") {
    nav("/signin")
  }     
}, [status, nav])

if (status === "loading") {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
      <PulseLoader />
    </div>
  )
}

if (status === "unauthenticated") {
  return null
}

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  })

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
      await axios.post("/api/link/create", {
        ...form,
      })
      toast.success("Link created successfully 🚀")
      router.replace("/dashboard")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-gray-200">

      <Header  />
      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">
          Create New Link
        </h1>

        <div className="space-y-3">
          <div>URL :</div>
          <input
            name="url"
            placeholder="https://example.com"
            value={form.url}
            onChange={handleChange}
            className="w-full rounded-lg   bg-[#121826] px-4 py-3 text-sm border border-[#1f2937] focus:border-orange-500  outline-none"
          />
            <div>Title :</div>
          <input
            name="title"
            placeholder="Title (eg. Shopping)"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg bg-[#121826] px-4 py-3 text-sm border border-[#1f2937] focus:border-orange-500 outline-none"
          />
             <div>Description :</div>
          <textarea
            name="description"
            placeholder="Short description about this link"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg bg-[#121826] px-4 py-3 text-sm border border-[#1f2937] focus:border-orange-500 outline-none resize-none"
          />
             <div>Tags :</div>
          <input
            name="tags"
            placeholder="Seperate multiple tags with ',' (eg. Puma, T-shirt, Brand)"
            value={form.tags}
            onChange={handleChange}
            className="w-full rounded-lg bg-[#121826] px-4 py-3 text-sm border border-[#1f2937] focus:border-orange-500 outline-none"
          />
          
        </div>
        <div className="mt-6">
            <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 text-md font-semibold text-black hover:bg-orange-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Confirm & Create Link"}
          </button>
          </div>
      </div>
    </div>
  )
}
