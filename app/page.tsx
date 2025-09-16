"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)

    if (currentUser) {
      router.push("/dashboard")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">♻️</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/logo.webp" 
              alt="EcoConstruye" 
              width={40} 
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <span className="text-2xl font-bold" style={{ color: '#f5924e' }}>EcoConstruye</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Conectamos materiales de construcción con quienes los necesitan
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Plataforma que permite a empresas constructoras donar materiales sobrantes a ONGs y organizaciones sociales,
            promoviendo la construcción sostenible y el impacto social.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=empresa">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <span className="mr-2">🏢</span>
                Soy una Empresa Constructora
              </Button>
            </Link>
            <Link href="/register?type=ong">
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <span className="mr-2">❤️</span>
                Soy una ONG
              </Button>
            </Link>
            <Link href="/register?type=voluntario">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <span className="mr-2">♻️</span>
                Soy Voluntario
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Cómo funciona?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="text-5xl text-blue-600 mx-auto mb-4">🏢</div>
                <CardTitle>Empresas Publican</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Las constructoras registran materiales sobrantes con ubicación, horarios de retiro y detalles del
                  producto.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-5xl text-green-600 mx-auto mb-4">❤️</div>
                <CardTitle>ONGs Buscan</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Las organizaciones sociales exploran materiales disponibles y solicitan los que necesitan para sus
                  proyectos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-5xl text-orange-600 mx-auto mb-4">♻️</div>
                <CardTitle>Impacto Positivo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Se reduce el desperdicio, se apoya a comunidades necesitadas y se promueve la construcción sostenible.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Toneladas de Material Reutilizado</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Proyectos Sociales Apoyados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">75+</div>
              <div className="text-gray-600">Empresas y ONGs Conectadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl">♻️</span>
            <span className="text-xl font-bold">EcoConstruye</span>
          </div>
          <p className="text-gray-400 mb-4">Construyendo un futuro más sostenible, un material a la vez.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">
              Términos de Uso
            </a>
            <a href="#" className="hover:text-white">
              Privacidad
            </a>
            <a href="#" className="hover:text-white">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
