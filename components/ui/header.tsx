"use client"

import { useEffect } from "react"
import { Menu } from "lucide-react"
import { useNav } from "@/lib/navigate"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

interface HeaderProps {
  session: Session | null
}

export default function Header() {
  const nav = useNav()
    const session = useSession()


  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-[#1f2937]">
      <div className="text-2xl font-bold text-orange-500">
        LinkIT
      </div>
      <div className="w-[40%]" />
      <div className="flex items-center gap-4">
        

        <div className="flex items-center gap-2">
          <img
            src={session.data?.user?.image || "/avatar.png"}
            alt="user"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-sm">
            {session.data?.user?.name}
          </span>
        </div>
      </div>
    </div>
  )
}
