"use client"

import { motion } from "framer-motion"
import FmButton from "../../components/ui/fm-button"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useNav } from "@/lib/navigate"
import { PulseLoader } from "@/components/ui/loader"
export default  function Hero() {
  const nav = useNav()
  const session =useSession()
  console.log(session.status)
  useEffect(()=>{
    if(session.status==='unauthenticated'){
      return nav('/signin')
    }
  },[ session.status])

  if(session.status==='loading'){
    return <PulseLoader></PulseLoader>
  }
  if(session.status==='unauthenticated'){
    return null
  }
  
    return(
    <div className="flex flex-col justify-center items-center min-h-screen text-center bg-gradient-to-b from-[#0F1115] via-[#121826] to-[#0B0E14]">

      {/* Title */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-8xl font-bold m-1.5 text-orange-500"
      >
        LinkIT
      </motion.div>

      {/* Punch line */}
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
      
      <FmButton text="Get Started" navigateTo={'/dashboard'}></FmButton>
      
    </div>
  )
}
