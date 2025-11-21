"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { ShoppingList } from "@/components/shopping-list"
import { db } from "@/lib/db"

export default function ShoppingListPage() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuthContext()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user) {
      setItems(db.getShoppingList(user.id))
    }
  }, [user])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <ShoppingList items={items} onUpdate={() => user && setItems(db.getShoppingList(user.id))} />
      </main>
    </div>
  )
}
