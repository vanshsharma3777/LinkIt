import { redirect } from "next/navigation"

export const nav = (address:string | undefined)=>{
    if(address){
        redirect(address)
    }
}
