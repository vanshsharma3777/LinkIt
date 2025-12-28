import { SignIn } from "@/components/authComponents"
import { signOut } from "next-auth/react"
import { Rye } from "next/font/google"


export default function signIn() {
    
    return (
        <div>
            <SignIn></SignIn>
            
        </div>
    )
}
