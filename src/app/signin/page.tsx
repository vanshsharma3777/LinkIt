import { SignIn } from "@/components/authComponents"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F1115] via-[#121826] to-[#0B0E14]">
      
      <div className="w-full max-w-md rounded-2xl border border-[#1f2937] bg-[#121826] p-8 shadow-xl">
        
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold text-orange-500">
            LinkIT
          </h1>
          <p className="mt-2 text-md text-gray-400">
            Sign in to manage and organize your links
          </p>
          <div className="mt-5">
            <SignIn  />
          </div>
        </div>
        

      </div>
    </div>
  )
}
