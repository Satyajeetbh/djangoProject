"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { db } from "@/lib/db"
import Link from "next/link"

export default function NewRecipe() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuthContext()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    calories: 300,
    ingredients: [{ name: "", amount: 1, unit: "g" }],
    instructions: [""],
    dietary: [] as string[],
  })
  const [error, setError] = useState("")

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === "amount" ? Number.parseFloat(value) : value,
    }
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }))
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions]
    newInstructions[index] = value
    setFormData((prev) => ({
      ...prev,
      instructions: newInstructions,
    }))
  }

  const handleDietaryToggle = (dietary: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(dietary as any)
        ? prev.dietary.filter((d) => d !== dietary)
        : [...prev.dietary, dietary],
    }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: 1, unit: "g" }],
    }))
  }

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }))
    }
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }))
  }

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Recipe name is required")
      return
    }

    if (formData.ingredients.some((ing) => !ing.name.trim())) {
      setError("All ingredients must have a name")
      return
    }

    if (formData.instructions.some((inst) => !inst.trim())) {
      setError("All instructions must be filled")
      return
    }

    if (!user) {
      setError("User not authenticated")
      return
    }

    try {
      const ingredients = formData.ingredients
        .filter((ing) => ing.name.trim()) // Filter out empty ingredients
        .map((ing) => ({
          id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          name: ing.name.trim(),
          amount: ing.amount,
          unit: ing.unit,
        }))

      const instructions = formData.instructions.filter((inst) => inst.trim())

      const newRecipe = db.createRecipe(user.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        ingredients,
        instructions,
        prepTime: formData.prepTime,
        cookTime: formData.cookTime,
        servings: formData.servings,
        calories: formData.calories,
        dietary: formData.dietary,
      })

      console.log("[v0] Recipe created successfully:", newRecipe)

      router.push(`/recipes/${newRecipe.id}`)
    } catch (err) {
      console.error("[v0] Error creating recipe:", err)
      setError("Failed to create recipe. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Recipes
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-4xl font-bold text-card-foreground mb-8">Create New Recipe</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Recipe Details</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recipe Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter recipe name"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your recipe"
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prep Time (min)</label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cook Time (min)</label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Calories per Serving */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Calories per Serving</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter calories"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>

            {/* Dietary */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Dietary Options</h2>
              <div className="flex flex-wrap gap-4">
                {["vegan", "vegetarian", "glutenFree", "dairyFree"].map((diet) => (
                  <label key={diet} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dietary.includes(diet)}
                      onChange={() => handleDietaryToggle(diet)}
                      className="w-4 h-4 rounded border-input cursor-pointer"
                    />
                    <span className="text-foreground capitalize">
                      {diet === "glutenFree" ? "Gluten Free" : diet === "dairyFree" ? "Dairy Free" : diet}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Ingredients *</h2>
              <div className="space-y-3">
                {formData.ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                      className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={ing.amount}
                      onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                      className="w-20 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                      className="w-20 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="cup">cup</option>
                      <option value="tbsp">tbsp</option>
                      <option value="tsp">tsp</option>
                      <option value="pcs">pcs</option>
                    </select>
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
              >
                + Add Ingredient
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Instructions *</h2>
              <div className="space-y-3">
                {formData.instructions.map((inst, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-semibold text-sm mt-2">
                      {index + 1}
                    </span>
                    <textarea
                      placeholder={`Step ${index + 1}`}
                      value={inst}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      rows={2}
                      className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addInstruction}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
              >
                + Add Step
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-semibold text-lg"
              >
                Create Recipe
              </button>
              <Link
                href="/dashboard"
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
