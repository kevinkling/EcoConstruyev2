"use client"

import { useState, useEffect } from "react"
import { AuthService } from "@/lib/auth"
import { mockMaterials, mockRequests, materialCategories } from "@/lib/mock-data"
import type { Material, DonationRequest, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MaterialCard } from "@/components/material-card"
import { RequestMaterialDialog } from "@/components/request-material-dialog"

import { ActivityFeed } from "@/components/activity-feed" // Verify this path or create the missing file
import { ImpactDashboard } from "@/components/charts/impact-dashboard"

// Type for Material Category
type MaterialCategory = "cemento" | "ladrillos" | "hierro" | "madera" | "ceramicos" | "sanitarios" | "electricidad" | "pintura" | "otros"

export default function ONGDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [myRequests, setMyRequests] = useState<DonationRequest[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | "all">("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "ong") {
      window.location.href = "/login"
      return
    }

    setUser(currentUser)
    // Mostrar solo materiales disponibles
    const availableMaterials = mockMaterials.filter((m: Material) => m.status === "disponible")
    setMaterials(availableMaterials)
    setFilteredMaterials(availableMaterials)

    // Filtrar solicitudes de esta ONG
    setMyRequests(mockRequests.filter((r: DonationRequest) => r.ongId === currentUser.id))
  }, [])

  useEffect(() => {
    let filtered = materials

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (material) =>
          material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((material) => material.category === selectedCategory)
    }

    // Filtrar por ciudad
    if (selectedCity !== "all") {
      filtered = filtered.filter((material) => material.location.includes(selectedCity))
    }

    setFilteredMaterials(filtered)
  }, [materials, searchTerm, selectedCategory, selectedCity])

  if (!user) {
    return <div>Cargando...</div>
  }

  // Extraer ciudades de las ubicaciones de materiales
  const cities = Array.from(new Set(materials.map((m) => {
    // Extraer ciudad del string de ubicación (asumiendo formato "dirección, ciudad")
    const parts = m.location.split(", ")
    return parts[parts.length - 1] || m.location
  })))

  const stats = {
    availableMaterials: materials.length,
    myRequests: myRequests.length,
    approvedRequests: myRequests.filter((r) => r.status === "aprobada").length,
    pendingRequests: myRequests.filter((r) => r.status === "pendiente").length,
  }

  const handleRequestMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setShowRequestDialog(true)
  }

  const handleSubmitRequest = (materialId: string, message: string) => {
    // En un entorno real, esto sería una llamada a la API
    const newRequest: DonationRequest = {
      id: Date.now().toString(),
      materialId: materialId,
      ongId: user.id,
      ongName: user.name,
      requestedQuantity: 1, // Valor por defecto, en la UI real se permitiría especificar
      message,
      status: "pendiente",
      requestDate: new Date().toISOString(),
    }

    setMyRequests([...myRequests, newRequest])
    setShowRequestDialog(false)
    setSelectedMaterial(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido, {user.name}</h1>
          <p className="text-gray-600">Explora materiales de construcción disponibles para tu organización</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materiales Disponibles</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableMaterials}</div>
              <p className="text-xs text-muted-foreground">Listos para solicitar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mis Solicitudes</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.myRequests}</div>
              <p className="text-xs text-muted-foreground">Total enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
              <p className="text-xs text-muted-foreground">Listas para recoger</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">En revisión</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="explore" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="explore">Explorar Materiales</TabsTrigger>
                <TabsTrigger value="requests">
                  Mis Solicitudes
                  {stats.pendingRequests > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {stats.pendingRequests}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="impact">Impacto Social</TabsTrigger>
              </TabsList>

              <TabsContent value="explore" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtros de Búsqueda
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Buscar</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar materiales..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Categoría</label>
                        <Select
                          value={selectedCategory}
                          onValueChange={(value) => setSelectedCategory(value as MaterialCategory | "all")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {materialCategories.map((category: any) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ciudad</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las ciudades</SelectItem>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Materiales Disponibles ({filteredMaterials.length})</h2>
                  </div>

                  {filteredMaterials.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron materiales</h3>
                        <p className="text-gray-600 text-center">
                          Intenta ajustar los filtros de búsqueda para encontrar materiales disponibles
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredMaterials.map((material) => (
                        <MaterialCard
                          key={material.id}
                          material={material}
                          showActions={false}
                          onView={() => handleRequestMaterial(material)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="requests" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Mis Solicitudes</h2>
                  <p className="text-gray-600 mb-6">Revisa el estado de tus solicitudes de materiales</p>
                </div>

                {myRequests.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes solicitudes</h3>
                      <p className="text-gray-600 text-center mb-4">
                        Explora los materiales disponibles y envía tu primera solicitud
                      </p>
                      <Button onClick={() => {
                        const tabElement = document.querySelector('[data-state="inactive"]') as HTMLElement
                        if (tabElement) {
                          tabElement.click()
                        }
                      }}>
                        Explorar Materiales
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((request) => {
                      const material = materials.find((m) => m.id === request.materialId)
                      if (!material) return null

                      const statusConfig = {
                        pendiente: { icon: Clock, color: "text-orange-600", bg: "bg-orange-50", label: "Pendiente" },
                        aprobada: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Aprobada" },
                        rechazada: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Rechazada" },
                        completada: {
                          icon: CheckCircle,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                          label: "Completada",
                        },
                      }

                      const status = statusConfig[request.status]
                      const StatusIcon = status.icon

                      return (
                        <Card key={request.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{material.name}</CardTitle>
                                <p className="text-gray-600 mt-1">{material.location}</p>
                              </div>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                                <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium mb-1">Tu mensaje:</h4>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">{request.message}</p>
                              </div>

                              <div className="text-sm text-gray-500">
                                Enviado el{" "}
                                {new Date(request.requestDate).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>

                              {request.status === "aprobada" && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                  <h4 className="font-medium text-green-800 mb-2">¡Solicitud Aprobada!</h4>
                                  <p className="text-green-700 text-sm mb-3">
                                    Puedes coordinar la recogida del material contactando directamente con la empresa.
                                  </p>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Empresa:</strong> {material.companyName}
                                    </p>
                                    <p>
                                      <strong>Ubicación:</strong> {material.location}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Impacto Social de EcoConstruye</h2>
                  <p className="text-gray-600 mb-6">
                    Descubre el impacto positivo que estamos generando juntos en la comunidad y el medio ambiente
                  </p>
                </div>
                <ImpactDashboard />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <ActivityFeed user={user} limit={8} />
          </div>
        </div>
      </main>

      {/* Request Material Dialog */}
      {selectedMaterial && (
        <RequestMaterialDialog
          material={selectedMaterial}
          open={showRequestDialog}
          onClose={() => {
            setShowRequestDialog(false)
            setSelectedMaterial(null)
          }}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  )
}
