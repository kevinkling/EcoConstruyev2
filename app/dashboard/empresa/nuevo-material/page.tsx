"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import type { MaterialCategory, MaterialCondition } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { LocationMap } from "@/components/location-map"

const materialCategories: { value: MaterialCategory; label: string }[] = [
  { value: "demolicion", label: "Materiales de Demolición" },
  { value: "ceramicos", label: "Cerámicos y Azulejos" },
  { value: "madera", label: "Madera" },
  { value: "metal", label: "Metal y Hierro" },
  { value: "concreto", label: "Concreto y Cemento" },
  { value: "ladrillos", label: "Ladrillos y Bloques" },
  { value: "tuberia", label: "Tubería y Fontanería" },
  { value: "electrico", label: "Material Eléctrico" },
  { value: "otros", label: "Otros" },
]

const materialConditions: { value: MaterialCondition; label: string }[] = [
  { value: "excelente", label: "Excelente - Como nuevo" },
  { value: "bueno", label: "Bueno - Listo para usar" },
  { value: "regular", label: "Regular - Necesita revisión" },
  { value: "para_reciclaje", label: "Para reciclaje" },
]

const weekDays = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
]

export default function NuevoMaterialPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as MaterialCategory | "",
    quantity: "",
    unit: "",
    condition: "" as MaterialCondition | "",
    // Ubicación
    address: "",
    city: "",
    contactPerson: "",
    contactPhone: "",
    coordinates: null as { lat: number; lng: number } | null,
    // Horarios
    selectedDays: [] as string[],
    startTime: "",
    endTime: "",
    specialInstructions: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "empresa") {
      router.push("/login")
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  if (isLoading || !user) {
    return <div>Cargando...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validaciones
    if (!formData.title || !formData.category || !formData.quantity || !formData.condition) {
      setError("Por favor completa todos los campos obligatorios")
      setLoading(false)
      return
    }

    if (formData.selectedDays.length === 0) {
      setError("Selecciona al menos un día para la recogida")
      setLoading(false)
      return
    }

    try {
      // En un entorno real, aquí se haría la llamada a la API
      console.log("Creando material:", formData)

      // Simular creación exitosa
      setTimeout(() => {
        router.push("/dashboard/empresa?created=true")
      }, 1000)
    } catch (err) {
      setError("Error al crear el material. Inténtalo de nuevo.")
      setLoading(false)
    }
  }

  const handleDayToggle = (dayId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter((d) => d !== dayId)
        : [...prev.selectedDays, dayId],
    }))
  }

  const handleLocationChange = (location: {
    address: string
    city: string
    coordinates?: { lat: number; lng: number }
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: location.address,
      city: location.city,
      coordinates: location.coordinates || null,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/dashboard/empresa"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Agregar Nuevo Material</h1>
          <p className="text-gray-600 mt-2">Registra materiales de construcción disponibles para donación</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Material */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Información del Material
              </CardTitle>
              <CardDescription>Describe el material que quieres donar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Material *</Label>
                  <Input
                    id="title"
                    placeholder="ej. Ladrillos de demolición"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as MaterialCategory }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el estado, origen y características del material..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidad</Label>
                  <Input
                    id="unit"
                    placeholder="ej. unidades, m², kg"
                    value={formData.unit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Estado *</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, condition: value as MaterialCondition }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado del material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialConditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación de la Obra
              </CardTitle>
              <CardDescription>Dónde pueden recoger el material las ONGs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    placeholder="Calle Mayor 123"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    placeholder="Madrid"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ubicación en el Mapa</Label>
                <LocationMap
                  address={formData.address}
                  city={formData.city}
                  onLocationChange={handleLocationChange}
                  showSearch={true}
                  height="350px"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Persona de Contacto *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Juan Pérez"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Teléfono de Contacto *</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+34 600 123 456"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horarios de Recogida */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios de Recogida
              </CardTitle>
              <CardDescription>Cuándo pueden recoger el material</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Días Disponibles *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={formData.selectedDays.includes(day.id)}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                      <Label htmlFor={day.id} className="text-sm font-normal">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora de Inicio *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora de Fin *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Instrucciones Especiales</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="ej. Acceso por la entrada lateral, traer vehículo de carga..."
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creando Material..." : "Crear Material"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
