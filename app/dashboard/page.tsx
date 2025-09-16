"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()

    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">♻️</div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">No se pudo cargar el usuario. Redirigiendo...</p>
        </div>
      </div>
    )
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "empresa":
        return {
          title: "Empresa Constructora",
          icon: "🏢",
          color: "bg-blue-600",
          description: "Gestiona tus materiales y donaciones",
        }
      case "ong":
        return {
          title: "ONG",
          icon: "❤️",
          color: "bg-green-600",
          description: "Busca y solicita materiales para tus proyectos",
        }
      case "voluntario":
        return {
          title: "Voluntario",
          icon: "♻️",
          color: "bg-orange-600",
          description: "Ayuda en el transporte y coordinación",
        }
      default:
        return {
          title: "Usuario",
          icon: "👤",
          color: "bg-gray-600",
          description: "Bienvenido a EcoConstruye",
        }
    }
  }

  const roleInfo = getRoleInfo(user.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/images/logo.webp" 
              alt="EcoConstruye" 
              width={32} 
              height={32}
              className="w-8 h-8 object-contain"
              priority
            />
            <h1 className="text-2xl font-bold" style={{ color: '#f5924e' }}>EcoConstruye</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{roleInfo.icon}</span>
              {roleInfo.title}
            </Badge>
            <Button
              variant="outline"
              onClick={() => {
                AuthService.logout()
                router.push("/")
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, {user.name}!</h2>
          <p className="text-gray-600 text-lg">{roleInfo.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Impacto Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">500+ ton</div>
              <p className="text-sm text-gray-600">Material reutilizado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Proyectos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">150+</div>
              <p className="text-sm text-gray-600">En toda la plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Comunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">75+</div>
              <p className="text-sm text-gray-600">Organizaciones conectadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Role-specific dashboard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div
                className={`w-12 h-12 ${roleInfo.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}
              >
                {roleInfo.icon}
              </div>
              <CardTitle>Mi Dashboard</CardTitle>
              <CardDescription>Accede a tu panel principal de {roleInfo.title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/${user.role}`}>
                <Button className="w-full">Ir a Mi Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Explore Platform */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                🌍
              </div>
              <CardTitle>Explorar Plataforma</CardTitle>
              <CardDescription>Descubre todos los materiales y proyectos disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Explorar
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                💬
              </div>
              <CardTitle>Ayuda y Soporte</CardTitle>
              <CardDescription>¿Necesitas ayuda? Consulta nuestras guías y contacto</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Ver Ayuda
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Nueva donación completada</p>
                  <p className="text-sm text-gray-600">Cemento Portland - 2 toneladas</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">Hace 2 horas</div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  📦
                </div>
                <div>
                  <p className="font-medium">Nuevo material disponible</p>
                  <p className="text-sm text-gray-600">Ladrillos cerámicos - Villa Crespo</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">Hace 5 horas</div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                  🚚
                </div>
                <div>
                  <p className="font-medium">Transporte coordinado</p>
                  <p className="text-sm text-gray-600">Voluntario asignado para entrega</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">Ayer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
