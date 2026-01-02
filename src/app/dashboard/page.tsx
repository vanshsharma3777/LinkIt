"use client"

import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useNav } from "@/lib/navigate"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { PulseLoader } from "../../../components/ui/loader"
import ShareOption from "../../../components/ui/shareOption"
import { Menu, Check, ExternalLink, Heading, Globe, AlignLeft, Text, Pencil, Trash2, Calendar, Tag as TagIcon, Hash, Type, X } from "lucide-react"
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
  const [openFilter, setOpenFilter] = useState(false)
  const [searchBy, setSearchBy] = useState<SearchBy>("title")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const nav = useNav()
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/user-details`)
        setLinks(res.data.userLinks)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          nav("/signin")
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredLinks = [...links]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((link) => {
      const q = query.toLowerCase().trim()
      if (!q) return true
      switch (searchBy) {
        case "title": return link.title.toLowerCase().includes(q)
        case "url": return link.url.toLowerCase().includes(q)
        case "description": return (link.description ?? "").toLowerCase().includes(q)
        case "tags": return link.tags?.some(tag => tag.name.toLowerCase().includes(q)) ?? false
        default: return true
      }
    })

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await axios.delete(`/api/link/delete/${deleteId}`)
      setLinks((prev) => prev.filter((link) => link.id !== deleteId))
      toast.success("Link deleted successfully")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete link")
    } finally {
      setDeleting(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
        <PulseLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1115] pb-10 text-gray-200 font-sans">
      <nav className="sticky top-0 z-40 bg-[#0F1115]/80 backdrop-blur-md border-b border-[#1f2937] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div
            className="text-xl md:text-xl font-black tracking-tighter text-orange-500 cursor-pointer"
            onClick={() => nav("/")}
          >
            LinkIT
          </div>
          <div className="relative flex-1 max-w-md group">
            <input
              type="text"
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${searchBy}...`}
              className="w-full rounded-full bg-[#121826] px-5 py-2 text-sm text-gray-300 outline-none border border-[#1f2937] focus:border-orange-500 transition-all pr-20"
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
              <kbd className="flex items-center justify-center h-5 w-5 text-[12px] font-sans font-medium text-gray-500 bg-[#1f2937] border border-[#374151] rounded opacity-100 group-focus-within:opacity-0 transition-opacity">
                /
              </kbd>
            </div>
            <button
              onClick={() => setOpenFilter((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400"
            >
              <Menu size={18} />
            </button>

            <AnimatePresence>
              {openFilter && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-44 rounded-xl bg-[#121826] border border-[#1f2937] shadow-2xl z-50 overflow-hidden"
                >
                  {(["title", "url", "description", "tags"] as SearchBy[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => { setSearchBy(option); setOpenFilter(false) }}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#1f2937] transition-colors"
                    >
                      <span className="capitalize">{option}</span>
                      {searchBy === option && <Check size={14} className="text-orange-500" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4" ref={profileRef}>
            <button
              onClick={() => nav("/create")}
              className="hidden md:flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-black hover:bg-orange-400 transition-transform active:scale-95"
            >
              + Add Link
            </button>

            <div className="relative">
              <img
                src={session?.user?.image || "/profile.png"}
                alt="User"
                onClick={() => setOpenProfile(!openProfile)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#1f2937] cursor-pointer hover:border-orange-500 transition-colors"
              />

              <AnimatePresence>
                {openProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-40 rounded-xl bg-[#121826] border border-[#1f2937] shadow-2xl z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => signOut({ callbackUrl: "/signin" })}
                      className="w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 text-left"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#121826] border border-[#1f2937] px-4 py-2 rounded-2xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-400">
                <strong className="text-gray-100">{filteredLinks.length}</strong>
                {filteredLinks.length === 1 ? ' Link Found' : ' Total Links'}
              </span>
            </div>

            {query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-[#1f2937]/30 px-3 py-1.5 rounded-full border border-[#1f2937]"
              >
                <span>Searching in <span className="text-orange-400 capitalize">{searchBy}</span></span>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setQuery("")}
                className="flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20 transition-all self-start md:self-auto"
              >
                <X size={14} />
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Your link collection is empty.</p>
            <button onClick={() => nav("/create")} className="text-orange-500 mt-2 font-semibold">Start adding links →</button>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredLinks.map((link, index) => (
                  <motion.div
                    key={link.id || `link-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="group flex flex-col justify-between bg-[#121826] border border-[#1f2937] rounded-2xl p-5 hover:border-orange-500/40 transition-all hover:shadow-lg"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Type size={18} className="text-orange-500 animate-pulse shrink-0" />
                          <h3 className="text-xl font-bold text-gray-300 uppercase tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
                            {link.title}
                          </h3>
                        </div>
                        <div className="flex gap-3 shrink-0 items-center">
                          {/* The Share Component */}
                          <ShareOption url={link.url} title={link.title} />

                          <button
                            onClick={() => nav(`/edit/${link.id}`)}
                            className="text-gray-500 hover:text-green-400   transition-colors p-2"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => setDeleteId(link.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <a
                        href={link.url}
                        target="_blank"
                        className="text-sm text-blue-400 flex items-center gap-1 hover:underline mb-3 line-clamp-2 break-all"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        {link.url}
                      </a>

                      <div className="flex items-start gap-2 mb-6">
                        <AlignLeft size={16} className="text-gray-500 mt-1 shrink-0" />
                        <p className="text-md text-gray-400 line-clamp-2 h-10">
                          {link.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-gray-600 shrink-0" />
                        <div className="flex flex-wrap gap-1.5">
                          {link.tags && link.tags.length > 0 ? (
                            link.tags.map((tag, tagIndex) => (
                              <span
                                key={`tag-${tag.name}-${tagIndex}`}
                                className="text-[10px] uppercase font-bold tracking-wider bg-[#1f2937] text-gray-400 px-2 py-0.5 rounded border border-white/5"
                              >
                                {tag.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-600 italic">No tags</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#1f2937] flex items-center justify-between text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(link.createdAt).toLocaleDateString()}
                        </div>
                        <span>
                          {new Date(link.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredLinks.length === 0 && query && (
              <div className="py-20 text-center text-gray-500">
                No matches found for <span className="text-orange-400">"{query}"</span>
              </div>
            )}
          </>
        )}
      </main>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => nav("/create")}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-orange-500 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/20"
      >
        <span className="text-2xl font-bold">+</span>
      </motion.button>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl bg-[#121826] p-6 border border-[#1f2937] shadow-2xl"
            >
              <h2 className="text-lg font-bold text-gray-100 mb-2">Delete Link?</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                This action cannot be undone. This link will be permanently removed from your account.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="px-5 py-2 text-sm rounded-xl bg-[#1f2937] text-gray-300 hover:bg-[#2a3546] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-5 py-2 text-sm font-bold rounded-xl bg-red-500 text-black hover:bg-red-400 disabled:opacity-50 transition-colors"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 