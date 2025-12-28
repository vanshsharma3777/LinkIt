'use client'

import { Button } from "@/components/ui/button"
import { nav } from '../../lib/navigate'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
 

export default function  home(){
  const session = useSession()
  const router = useRouter()
  if(session.status==='unauthenticated'){
    nav('/signin')
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col ">
        <Button className="m-4 bg-green-500">GET STARTED</Button>
      <Button className="m-4 bg-red-600" onClick={()=>{
        nav('/signin')
      }}>LOG OUT</Button> 
      </div>
    </div>
  )
}