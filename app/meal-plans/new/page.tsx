"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { db } from "@/lib/db"
import Link from "next/link"

export default function NewMealPlan() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuthContext()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mealType: "lunch" as "breakfast" | "lunch" | "dinner" | "snack",
    recipeId: "",
  })
  const [error, setError] = useState("")
  const [recipes, setRecipes] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user) {
      const userRecipes = db.getAllRecipes(user.id)
      setRecipes(userRecipes)
      if (userRecipes.length > 0) {
        setFormData((prev) => ({
          ...prev,
          recipeId: userRecipes[0].id,
        }))
      }
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.date) {
      setError("Date is required")
      return
    }

    if (!formData.recipeId) {
      setError("Please select a recipe")
      return
    }

    if (!user) {
      setError("User not authenticated")
      return
    }

    try {
      const newMealPlan = db.createMealPlan(user.id, {
        date: formData.date,
        mealType: formData.mealType,
        recipeId: formData.recipeId,
      })

      console.log("[v0] Meal plan created successfully:", newMealPlan)
      router.push("/meal-plans")
    } catch (err) {
      console.error("[v0] Error creating meal plan:", err)
      setError("Failed to create meal plan. Please try again.")
    }
  }

  const selectedRecipe = recipes.find((r) => r.id === formData.recipeId)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/meal-plans" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Meal Plans
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-4xl font-bold text-card-foreground mb-8">Add Meal to Plan</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Meal Type *</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Recipe Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Recipe *</label>
              {recipes.length === 0 ? (
                <div className="p-4 bg-muted border border-border rounded-lg text-center">
                  <p className="text-muted-foreground">
                    No recipes found. Please{" "}
                    <Link href="/recipes/new" className="text-primary hover:underline font-semibold">
                      create a recipe first
                    </Link>
                  </p>
                </div>
              ) : (
                <select
                  name="recipeId"
                  value={formData.recipeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                >
                  <option value="">Choose a recipe...</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Recipe Preview */}
            {selectedRecipe && (
              <div className="bg-muted border border-border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-foreground">{selectedRecipe.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRecipe.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    Prep: {selectedRecipe.prepTime}min | Cook: {selectedRecipe.cookTime}min
                  </p>
                  <p>
                    Servings: {selectedRecipe.servings} | Calories: {selectedRecipe.calories} per serving
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <button
                type="submit"
                disabled={recipes.length === 0}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Meal Plan
              </button>
              <Link
                href="/meal-plans"
                className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted font-semibold text-lg text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
