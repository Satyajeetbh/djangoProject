"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { RecipeList } from "@/components/recipe-list"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthContext()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">My Recipes</h1>
        <RecipeList />
      </main>
    </div>
  )
}
