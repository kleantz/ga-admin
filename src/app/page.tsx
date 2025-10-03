"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard - middleware will handle unauthenticated users
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-600">Loading...</div>
    </div>
  )
}

