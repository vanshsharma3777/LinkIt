import { useRouter } from "next/navigation"


export const useNav =()=>{
    const router = useRouter()

    return  (address:string | undefined) =>{
        if(address){
            router.push(address)
        }
    }
}