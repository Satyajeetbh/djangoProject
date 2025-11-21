"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { db } from "@/lib/db"
import Link from "next/link"

export default function RecipeDetail() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading, user } = useAuthContext()
  const recipeId = params.id as string

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  if (loading) return null

  const recipe = db.getRecipe(recipeId)

  if (!recipe || recipe.userId !== user?.id) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-foreground">Recipe not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Recipes
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-4xl font-bold text-card-foreground mb-2">{recipe.name}</h1>
          <p className="text-muted-foreground mb-6">{recipe.description}</p>

          <div className="grid grid-cols-4 gap-4 mb-8 py-4 border-y border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{recipe.prepTime}</p>
              <p className="text-sm text-muted-foreground">Prep (min)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{recipe.cookTime}</p>
              <p className="text-sm text-muted-foreground">Cook (min)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{recipe.servings}</p>
              <p className="text-sm text-muted-foreground">Servings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{recipe.prepTime + recipe.cookTime}</p>
              <p className="text-sm text-muted-foreground">Total (min)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="text-foreground">
                    <span className="font-semibold">{ing.amount}</span> {ing.unit} {ing.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Dietary</h2>
              {recipe.dietary.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {recipe.dietary.map((diet) => (
                    <span key={diet} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                      {diet}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No dietary restrictions</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Instructions</h2>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-foreground mt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
