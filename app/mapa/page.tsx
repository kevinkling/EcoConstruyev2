"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DonationMap } from "@/components/donation-map"
import { AuthService } from "@/lib/auth"
import { useState, useEffect } from "react"
import type { User } from "@/lib/types"

export default function MapaPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      window.location.href = "/login"
      return
    }
    setUser(currentUser)
  }, [])

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Donaciones</h1>
          <p className="text-gray-600">
            Visualiza las donaciones de materiales de construcción en tu zona y mantente informado 
            sobre el impacto de EcoConstruye en tiempo real.
          </p>
        </div>

        <DonationMap />
      </main>
    </div>
  )
}