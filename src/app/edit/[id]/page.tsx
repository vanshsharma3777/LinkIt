"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import Header from "../../../../components/ui/header"
import { PulseLoader } from "@/components/ui/loader"
import { useNav } from "@/lib/navigate"
import { Rye } from "next/font/google"

interface Tag {
    id: string
    name: string
}

export default function EditLink() {
    const { id } = useParams<{ id: string }>()
    const { data: session, status } = useSession()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        tags: "",
    })
    const nav = useNav()
    useEffect(() => {
        const fetchLink = async () => {
            try {
                setLoading(true)

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/link/update/${id}`
                )
                const link = res.data.doLinkExists
                if (!link) {
                    toast.error("Failed to load link")
                    router.replace("/dashboard")
                }
                console.log(link)
                setForm({
                    url: link.url,
                    title: link.title,
                    description: link.description || "",
                    tags: link.tags?.map((t: Tag) => t.name).join(", ") || "",
                })
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        nav("/signin")
                        return
                    }
                }
                console.error(error)
                toast.error("Failed to load link")
                router.replace("/dashboard")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchLink()
    }, [id, status])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
                <PulseLoader />
            </div>
        )
    }
    if (status === 'unauthenticated') {
        return null
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        if (!form.url || !form.title) {
            toast.error("URL and Title are required")
            return
        }

        try {
            setSaving(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/link/update/${id}`,
                form
            )

            toast.success("Link updated successfully ✨")
            router.replace("/dashboard")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update link")
        } finally {
            setSaving(false)
        }
    }
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
                <PulseLoader />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0F1115] text-gray-200">

            <Header />
            <div className="max-w-3xl mx-auto px-8 py-10">
                <h1 className="text-2xl font-bold text-orange-500 mb-6">
                    Edit Link
                </h1>

                <div className="space-y-5">
                    <input
                        name="url"
                        value={form.url}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full rounded-lg bg-[#121826] px-4 py-3  text-gray-400  text-sm border border-[#1f2937] focus:border-orange-500 outline-none"
                    />
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title (eg. React Docs)"
                        className="w-full rounded-lg bg-[#121826] px-4 py-3  text-gray-400  text-sm border border-[#1f2937] focus:border-orange-500 outline-none"
                    />

                    <textarea
                        name="description"
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Short description about this link"
                        className="w-full rounded-lg bg-[#121826] px-4 py-3  text-gray-400  text-sm border border-[#1f2937] focus:border-orange-500 outline-none resize-none"
                    />
                    <input
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="Seperate multiple tags with ',' (eg. Puma, T-shirt, Brand)"
                        className="w-full rounded-lg bg-[#121826] px-4 py-3  text-gray-400  text-sm border border-[#1f2937] focus:border-orange-500 outline-none"
                    />
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-black hover:bg-orange-400 disabled:opacity-60"
                    >
                        {saving ? "Updating..." : "Confirm & Update Link"}
                    </button>
                </div>
            </div>
        </div>
    )
}
