"use client"

import { useNav } from "@/lib/navigate"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
type FmButtonProps = {
  text: string
  navigateTo?: string
}
const  FmBtton=({text , navigateTo }:FmButtonProps)=> {
    const router = useRouter()
    const nav = useNav()
  return (
    <motion.button
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        ease:"easeInOut",
        delay: 0.2,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 0px 30px rgba(59,130,246,0.45)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={()=>{
        nav(navigateTo)
      }}
      className="
        mt-10 px-10 py-4
        rounded-xl font-semibold text-lg
        bg-blue-500 text-white
        hover:bg-blue-600
        transition-colors
        focus:outline-none
      "
    >
      {text}
    </motion.button>
  )
}

export default FmBtton