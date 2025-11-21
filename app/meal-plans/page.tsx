"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { MealPlanView } from "@/components/meal-plan-view"

export default function MealPlans() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthContext()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Meal Plans</h1>
        <MealPlanView />
      </main>
    </div>
  )
}
