"use client"

import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { useNav } from "@/lib/navigate"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { PulseLoader } from "../../../components/ui/loader"
import { Menu, Check } from "lucide-react"
import { User } from "lucide-react";
import { toast } from "sonner"

interface Tag {
  id: string
  name: string
}
interface UserLink {
  id: string
  title: string
  url: string
  description?: string
  tags?: Tag[]
  createdAt: string

}

type SearchBy = "title" | "url" | "description" | "tags"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [links, setLinks] = useState<UserLink[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [sendLink, setSendLink] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [searchBy, setSearchBy] = useState<SearchBy>("title")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)

  const nav = useNav()
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/user-details`)
        setLinks(res.data.userLinks)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            nav("/signin")
            return
          }
        }
      } finally {
        setLoading(false)
      }
    }
    fetchLinks()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
        <PulseLoader />
      </div>
    )
  }

  const filteredLinks = [...links]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .filter((link) => {
      const q = query.toLowerCase().trim()
      if (!q) return true

      switch (searchBy) {
        case "title":
          return link.title.toLowerCase().includes(q)
        case "url":
          return link.url.toLowerCase().includes(q)
        case "description":
          return (link.description ?? "").toLowerCase().includes(q)
        case "tags":
          return link.tags?.some(tag =>
            tag.name.toLowerCase().includes(q)
          ) ?? false
        default:
          return true
      }
    })

  const editLink = (id: string) => {
    setSendLink(id)
    nav(`/edit/${id}`)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await axios.delete(`/api/link/delete/${deleteId}`)
      setLinks((prev) => prev.filter((link) => link.id !== deleteId))
      toast.success("Link deleted successfully 🗑️")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete link")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1115] pb-20 md:pb-0 text-gray-200">
      <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-4 border-b border-[#1f2937]">

        <div className="text-2xl font-bold text-orange-500 whitespace-nowrap">LinkIT</div>

        <div className="relative flex-1 md:w-[40%]">

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${searchBy}...`}
            className="w-full rounded-lg bg-[#121826] px-4 py-2 pr-10 text-sm text-gray-300 outline-none border border-[#1f2937] focus:border-orange-500"
          />
          <button
            onClick={() => setOpenFilter((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400"
          >
            <Menu size={18} />
          </button>

          {openFilter && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg bg-[#121826] border border-[#1f2937] shadow-lg z-50">
              {(["title", "url", "description", "tags"] as SearchBy[]).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSearchBy(option)
                    setOpenFilter(false)
                  }}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#1f2937]"
                >
                  <span className="capitalize">{option}</span>
                  {searchBy === option && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-4" ref={profileRef}>
          <button
            onClick={() => nav("/create")}
            className="hidden md:inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-400"
          >
            + Add NewLink
          </button>


          <div
            onClick={() => setOpenProfile((p) => !p)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={session?.user?.image || "/profile.png"}
              alt="User"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="hidden md:inline text-sm">
              {session?.user?.name}
            </span>
          </div>


          {openProfile && (
            <div className="absolute right-0 top-12 w-40 rounded-lg bg-[#121826] border border-[#1f2937] shadow-lg z-50">
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-[#1f2937] text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>



      <div className="hidden md:grid px-8  py-4 text-sm text-gray-400  grid-cols-12 gap-4">
        <div className="col-span-2">Title</div>
        <div className="col-span-3">URL</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Tags</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {filteredLinks.length === 0 && query && (
        <div className="py-12 text-center text-gray-500">
          No results found for <span className="text-orange-400">"{query}"</span>
        </div>
      )}

      {links.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          Add new links
        </div>
      )}

      {filteredLinks.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="border-t border-[#1f2937]"
        >

          <div className="md:hidden px-4 py-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">URL</p>
              <a
                href={link.url}
                target="_blank"
                className="text-blue-400 break-all"
              >
                {link.url}
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-500">Title</p>
              <p className="font-medium">
                {link.title.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-400">
                {link.description || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Tags</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {link.tags && link.tags.length > 0 ? (
                  link.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs bg-[#1f2937] px-2 py-1 rounded"
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No tags</span>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-2 text-sm">
              <button
                onClick={() => nav(`/edit/${link.id}`)}
                className="text-green-400"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteId(link.id)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          </div>

          {/* ================= DESKTOP VIEW (UNCHANGED) ================= */}
          <div className="hidden md:grid px-8 py-4 grid-cols-12 gap-4 items-center hover:bg-[#121826]">
            <div className="col-span-2 font-medium truncate">
              {link.title.toUpperCase()}
            </div>

            <a
              href={link.url}
              target="_blank"
              className="col-span-3 text-blue-400 line-clamp-2 hover:underline"
            >
              {link.url}
            </a>

            <div className="col-span-4 text-sm text-gray-400 line-clamp-2">
              {link.description
                ? link.description.charAt(0).toUpperCase() + link.description.slice(1)
                : "—"}
            </div>

            <div className="col-span-2 flex gap-2 flex-wrap">
              {link.tags && link.tags.length > 0 ? (
                link.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-[#1f2937] px-2 py-1 rounded"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">No tags</span>
              )}
            </div>

            <div className="col-span-1 flex justify-end gap-2 text-sm">
              <button
                onClick={() => nav(`/edit/${link.id}`)}
                className="text-green-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteId(link.id)}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

        </motion.div>
      ))}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-[#121826] p-6 border border-[#1f2937]">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Delete Link?</h2>
            <p className="text-sm text-gray-400 mb-6">
              This action cannot be undone. Are you sure you want to delete this link?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-md bg-[#1f2937] text-gray-300 hover:bg-[#2a3546]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-black hover:bg-red-400 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => nav("/create")}
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50
             bg-orange-500 text-black px-6 py-3 rounded-xl w-[80%]
             font-semibold shadow-lg active:scale-95"
      >
        + Add NewLink
      </button>

    </div>
  )
}
