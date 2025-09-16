"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const volunteerSkills = [
  "Transporte de materiales",
  "Carga y descarga",
  "Coordinación logística",
  "Verificación de materiales",
  "Documentación de inventarios",
  "Planificación de rutas",
  "Operación de montacargas",
  "Supervisión de calidad",
  "Administración de depósitos",
  "Comunicación con empresas",
  "Gestión de voluntarios",
  "Conocimientos técnicos básicos",
]

const availability = ["Lunes a Viernes", "Fines de semana", "Mañanas", "Tardes", "Tiempo completo", "Medio tiempo"]

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userType = searchParams.get("type") || "empresa"

  const [formData, setFormData] = useState({
    // Campos comunes
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    description: "",
    
    // Campos específicos de empresa
    cuit: "",
    companySize: "",
    contactPerson: "",
    website: "",
    
    // Campos específicos de ONG
    projectType: "",
    registrationNumber: "",
    foundedYear: "",
    
    // Campos específicos de voluntario
    experience: "",
    location: "",
    selectedSkills: [] as string[],
    selectedAvailability: [] as string[],
  })

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        selectedSkills: [...prev.selectedSkills, skill],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedSkills: prev.selectedSkills.filter((s) => s !== skill),
      }))
    }
  }

  const handleAvailabilityChange = (time: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        selectedAvailability: [...prev.selectedAvailability, time],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedAvailability: prev.selectedAvailability.filter((a) => a !== time),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    console.log(`Registro de ${userType}:`, formData)
    alert(`¡Registro exitoso como ${userType}!`)
    router.push("/login")
  }

  const getPageTitle = () => {
    switch (userType) {
      case "empresa": return "Registro - Empresa Constructora"
      case "ong": return "Registro - ONG"
      case "voluntario": return "Registro - Voluntario"
      default: return "Registro"
    }
  }

  const getPageDescription = () => {
    switch (userType) {
      case "empresa": return "Únete como empresa para donar materiales de construcción"
      case "ong": return "Regístrate como ONG para recibir materiales"
      case "voluntario": return "Únete a nuestra comunidad y ayuda en proyectos de construcción sostenible"
      default: return "Crea tu cuenta en EcoConstruye"
    }
  }

  // Formulario para Empresas
  if (userType === "empresa") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900">
              ← Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600">{getPageDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🏢 Información de la Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre de la Empresa</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Constructora ABC S.A."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuit">CUIT</Label>
                    <Input
                      id="cuit"
                      value={formData.cuit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cuit: e.target.value }))}
                      placeholder="30-12345678-9"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="contacto@empresa.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+54 11 1234-5678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Av. Corrientes 1234, CABA"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Persona de Contacto</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio Web (opcional)</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.empresa.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companySize">Tamaño de la Empresa</Label>
                  <Select value={formData.companySize} onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequena">Pequeña (1-50 empleados)</SelectItem>
                      <SelectItem value="mediana">Mediana (51-200 empleados)</SelectItem>
                      <SelectItem value="grande">Grande (200+ empleados)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descripción de la Empresa</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu empresa, tipos de proyectos, años de experiencia..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🔐 Configuración de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Registrar Empresa
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Formulario para ONGs
  if (userType === "ong") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900">
              ← Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600">{getPageDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">❤️ Información de la Organización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre de la ONG</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Fundación Construyendo Futuro"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Número de Registro</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                      placeholder="CUIT o número de registro"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email de Contacto</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="contacto@ong.org"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+54 11 1234-5678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Av. Rivadavia 1234, CABA"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foundedYear">Año de Fundación</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      min="1900"
                      max="2025"
                      value={formData.foundedYear}
                      onChange={(e) => setFormData((prev) => ({ ...prev, foundedYear: e.target.value }))}
                      placeholder="2020"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Tipo de Proyectos</Label>
                    <Select value={formData.projectType} onValueChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vivienda">Vivienda Social</SelectItem>
                        <SelectItem value="educacion">Infraestructura Educativa</SelectItem>
                        <SelectItem value="salud">Centros de Salud</SelectItem>
                        <SelectItem value="comunitario">Espacios Comunitarios</SelectItem>
                        <SelectItem value="deportivo">Instalaciones Deportivas</SelectItem>
                        <SelectItem value="religioso">Espacios Religiosos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Misión y Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe la misión de tu organización, los proyectos que realizan, las comunidades que atienden..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🔐 Configuración de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Registrar ONG
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Formulario para Voluntarios (código existente)
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Voluntario</h1>
          <p className="text-gray-600">Únete a nuestra comunidad y ayuda en proyectos de construcción sostenible</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">👤 Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Ciudad, Provincia"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔨 Habilidades Profesionales</CardTitle>
              <CardDescription>Selecciona tus habilidades profesionales en construcción y transporte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Oficios y Especialidades</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {volunteerSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.selectedSkills.includes(skill)}
                        onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                      />
                      <Label htmlFor={skill} className="text-sm">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="experience">Experiencia Profesional</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe tu experiencia profesional en construcción, años de trabajo, proyectos realizados, certificaciones..."
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📅 Disponibilidad</CardTitle>
              <CardDescription>Indica cuándo puedes participar en los proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availability.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={formData.selectedAvailability.includes(time)}
                      onCheckedChange={(checked) => handleAvailabilityChange(time, checked as boolean)}
                    />
                    <Label htmlFor={time} className="text-sm">
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h3 className="font-medium text-blue-900">Selección de Proyectos</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Una vez que completes tu registro e inicies sesión, podrás explorar y seleccionar los proyectos de
                    donación donde quieres ayudar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Registrarse como Voluntario
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
