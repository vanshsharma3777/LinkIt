"use client"

import { motion } from "framer-motion"
import FmButton from "../../components/ui/fm-button"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useNav } from "@/lib/navigate"
import { PulseLoader } from "@/components/ui/loader"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Hero() {
  const nav = useNav()
  const session = useSession()

  useEffect(() => {
    if (session.status === "unauthenticated") {
      nav("/signin")
    }
  }, [session.status, nav])

  if (session.status === "loading") {
    return <PulseLoader />
  }

  if (session.status === "unauthenticated") {
    return null
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#0F1115] via-[#121826] to-[#0B0E14] text-center">

      {/* 🔗 SOCIAL LINKS (TOP RIGHT) */}
      <div className="absolute top-6 right-6 flex gap-4 text-gray-400">
        <a
          href="https://github.com/vanshsharma3777"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition"
        >
          <Github size={20} />
        </a>
        <a
          href="https://x.com/itz_sharmaji001"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition"
        >
          <Twitter size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/vansh-sharma-812199316"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition"
        >
          <Linkedin size={20} />
        </a>
      </div>

      {/* 🌟 HERO CONTENT */}
      <div className="flex flex-col justify-center items-center flex-1">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-8xl font-bold m-1.5 text-orange-500"
        >
          LinkIT
        </motion.div>

        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="text-3xl m-1.5 text-gray-300"
        >
          Save links. Remember why.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-gray-400 text-sm"
        >
          <span>• Save with purpose</span>
          <span>• Organize with tags</span>
          <span>• Find links instantly</span>
        </motion.div>

        <FmButton text="Get Started" navigateTo="/dashboard" />
      </div>

      {/* 🧡 FOOTER */}
      <footer className="py-6 text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-orange-500 font-medium">LinkIT</span> — Built with{" "}
        <span className="text-red-400 text-md">❤️</span> by Vansh
      </footer>
    </div>
  )
}
