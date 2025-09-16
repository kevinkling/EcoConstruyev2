"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await AuthService.login(email, password)
      if (user) {
        // Redirect based on user role
        if (user.role === "empresa") {
          router.push("/dashboard/empresa")
        } else if (user.role === "voluntario") {
          router.push("/dashboard/voluntario")
        } else {
          router.push("/dashboard/ong")
        }
      }
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
          <span className="text-xl">♻️</span>
          <span className="text-xl font-bold">EcoConstruye</span>
        </Link>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu cuenta de EcoConstruye</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">Cuentas de prueba:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>Empresa:</strong> empresa@demo.com / demo123
              </div>
              <div>
                <strong>ONG:</strong> ong@demo.com / demo123
              </div>
              <div>
                <strong>Voluntario:</strong> voluntario@demo.com / demo123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
