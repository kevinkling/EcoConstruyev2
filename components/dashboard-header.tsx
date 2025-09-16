"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { NotificationCenter } from "@/components/notification-center"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  user: User | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "empresa":
        return {
          title: "Empresa Constructora",
          icon: "🏢",
          color: "bg-blue-600",
        }
      case "ong":
        return {
          title: "ONG",
          icon: "❤️",
          color: "bg-green-600",
        }
      case "voluntario":
        return {
          title: "Voluntario",
          icon: "♻️",
          color: "bg-orange-600",
        }
      default:
        return {
          title: "Usuario",
          icon: "👤",
          color: "bg-gray-600",
        }
    }
  }

  if (!user) return null

  const roleInfo = getRoleInfo(user.role)

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">♻️</span>
          <h1 className="text-2xl font-bold text-gray-900">EcoConstruye</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <span>{roleInfo.icon}</span>
            {roleInfo.title}
          </Badge>
          {["empresa", "ong"].includes(user.role) && (
            <NotificationCenter notifications={[]} userType={user.role as "empresa" | "ong"} />
          )}
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}