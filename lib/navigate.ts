import { redirect } from "next/navigation"

export const nav = (address:string)=>{
    redirect(address)
}
