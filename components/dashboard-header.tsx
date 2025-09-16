"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { NotificationCenter } from "@/components/notification-center"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

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
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/images/logo.webp" 
            alt="EcoConstruye" 
            width={48} 
            height={48}
            style={{ width: '48px', height: '48px' }}
            className="object-contain"
            priority
          />
          <h1 className="text-2xl font-bold text-green-600">EcoConstruye</h1>
        </Link>
        
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