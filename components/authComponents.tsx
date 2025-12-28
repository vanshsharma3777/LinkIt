// components/authComponents.tsx
"use client"

import { signIn, signOut } from "next-auth/react"

export function SignIn({ provider = "google" }: { provider?: string }) {
  
  return (
    <button
      onClick={() => signIn(provider, { callbackUrl: "/" })}
      className="bg-neutral-700 text-white p-2 rounded-md hover:bg-neutral-600 transition"
    >
      Sign In with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  )
}

export function SignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition w-full"
    >
      Sign Out
    </button>
  )
}