"use client"

import { useState, useEffect } from "react"
import { AuthService } from "@/lib/auth"
import { mockMaterials, mockRequests } from "@/lib/mock-data"
import type { Material, DonationRequest, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, Users, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function EmpresaDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [requests, setRequests] = useState<DonationRequest[]>([])

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "empresa") {
      window.location.href = "/login"
      return
    }

    setUser(currentUser)
    // Filtrar materiales de esta empresa
    const empresaMaterials = mockMaterials.filter((m) => m.companyId === currentUser.id)
    
    // Si no hay materiales, agregar algunos de prueba
    if (empresaMaterials.length === 0) {
      const materialesPrueba: Material[] = [
        {
          id: "test-1",
          name: "Cemento Portland - 25kg",
          category: "cemento",
          quantity: 50,
          unit: "bolsas",
          description: "Cemento Portland tipo I, ideal para construcción general. Almacenado en condiciones óptimas.",
          condition: "nuevo",
          status: "disponible",
          companyId: currentUser.id,
          companyName: currentUser.name,
          location: "Bogotá, Colombia",
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "test-2", 
          name: "Ladrillos cerámicos - Villa Crespo",
          category: "ladrillos",
          quantity: 200,
          unit: "unidades",
          description: "Ladrillos cerámicos de alta calidad, sobrantes de proyecto residencial. Sin uso.",
          condition: "nuevo",
          status: "disponible",
          companyId: currentUser.id,
          companyName: currentUser.name,
          location: "Medellín, Colombia",
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "test-3",
          name: "Tubería PVC - 200 metros",
          category: "sanitarios",
          quantity: 1,
          unit: "lote",
          description: "Tubería PVC para instalaciones sanitarias, diámetro 4 pulgadas. En excelente estado.",
          condition: "usado-bueno",
          status: "reservado",
          companyId: currentUser.id,
          companyName: currentUser.name,
          location: "Cali, Colombia",
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "test-4",
          name: "Vigas de madera - Fundación Construir",
          category: "madera",
          quantity: 15,
          unit: "unidades",
          description: "Vigas de madera tratada para construcción. Dimensiones: 3m x 20cm x 15cm.",
          condition: "usado-regular",
          status: "donado",
          companyId: currentUser.id,
          companyName: currentUser.name,
          location: "Barranquilla, Colombia",
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setMaterials(materialesPrueba)
    } else {
      setMaterials(empresaMaterials)
    }
    
    // Filtrar solicitudes para materiales de esta empresa
    const empresaMaterialIds = mockMaterials.filter((m) => m.companyId === currentUser.id).map((m) => m.id)
    const empresaRequests = mockRequests.filter((r) => empresaMaterialIds.includes(r.materialId))
    
    // Si no hay solicitudes, agregar algunas de ejemplo
    if (empresaRequests.length === 0) {
      const solicitudesEjemplo: DonationRequest[] = [
        {
          id: "req-empresa-1",
          materialId: "test-1", // Cemento Portland
          ongId: "ong-1",
          ongName: "Fundación Hogar Esperanza",
          organizationName: "Fundación Hogar Esperanza",
          requestedQuantity: 30,
          message: "Solicitamos cemento para construcción de 2 viviendas para familias desplazadas. El proyecto beneficiará directamente a 8 personas.",
          status: "entregada",
          requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          responseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          pickupDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "req-empresa-2",
          materialId: "test-2", // Ladrillos cerámicos
          ongId: "ong-2",
          ongName: "ONG Construyendo Futuro",
          organizationName: "ONG Construyendo Futuro",
          requestedQuantity: 150,
          message: "Necesitamos ladrillos para construcción de biblioteca comunitaria en zona rural. Beneficiará a 200 niños de la comunidad.",
          status: "aprobada",
          requestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          responseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "req-empresa-3",
          materialId: "test-3", // Tubería PVC
          ongId: "ong-3",
          ongName: "Asociación San José",
          organizationName: "Asociación San José",
          requestedQuantity: 1,
          message: "Requerimos tubería PVC para instalación de sistema de agua potable en escuela veredal que atiende 45 estudiantes.",
          status: "pendiente",
          requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
      setRequests(solicitudesEjemplo)
    } else {
      setRequests(empresaRequests)
    }
  }, [])

  if (!user) {
    return <div>Cargando...</div>
  }

  const stats = {
    totalMaterials: materials.length,
    availableMaterials: materials.filter((m) => m.status === "disponible").length,
    pendingRequests: requests.filter((r) => r.status === "pendiente").length,
    completedDonations: materials.filter((m) => m.status === "donado").length,
  }

  const handleLogout = () => {
    AuthService.logout()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-green-600">
                EcoConstruye
              </Link>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido, {user.name}</h1>
          <p className="text-gray-600">Gestiona tus materiales de construcción y conecta con ONGs que los necesitan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materiales</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
              <p className="text-xs text-muted-foreground">Materiales registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.availableMaterials}</div>
              <p className="text-xs text-muted-foreground">Listos para donación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Pendientes de revisar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donaciones</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completedDonations}</div>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="materials" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="materials">Mis Materiales</TabsTrigger>
                <TabsTrigger value="requests">
                  Solicitudes
                  {stats.pendingRequests > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {stats.pendingRequests}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="impact">Impacto Social</TabsTrigger>
              </TabsList>

              <TabsContent value="materials" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Materiales Registrados</h2>
                  <Link href="/dashboard/empresa/nuevo-material">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Material
                    </Button>
                  </Link>
                </div>

                {materials.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes materiales registrados</h3>
                      <p className="text-gray-600 text-center mb-4">
                        Comienza agregando materiales de construcción que tengas disponibles para donar
                      </p>
                      <Link href="/dashboard/empresa/nuevo-material">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Primer Material
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {materials.map((material) => (
                      <Card key={material.id} className="overflow-hidden">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{material.name}</CardTitle>
                              <p className="text-sm text-gray-600">{material.category}</p>
                            </div>
                            <Badge 
                              variant={
                                material.status === "disponible" ? "default" :
                                material.status === "reservado" ? "secondary" :
                                material.status === "donado" ? "outline" : "destructive"
                              }
                            >
                              {material.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{material.description}</p>
                            <div className="flex justify-between text-sm">
                              <span><strong>Cantidad:</strong> {material.quantity} {material.unit}</span>
                              <span><strong>Estado:</strong> {material.condition}</span>
                            </div>
                            <p className="text-xs text-gray-500">{material.location}</p>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Eliminar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="requests" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Solicitudes de ONGs</h2>
                  <p className="text-gray-600 mb-6">
                    Revisa y gestiona las solicitudes de materiales de las organizaciones
                  </p>
                </div>

                {requests.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes pendientes</h3>
                      <p className="text-gray-600 text-center">
                        Las solicitudes de ONGs aparecerán aquí cuando estén interesadas en tus materiales
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => {
                      const material = materials.find(m => m.id === request.materialId)
                      
                      const statusConfig = {
                        pendiente: { color: "text-orange-600", bg: "bg-orange-50", label: "Pendiente" },
                        aprobada: { color: "text-green-600", bg: "bg-green-50", label: "Aprobada" },
                        rechazada: { color: "text-red-600", bg: "bg-red-50", label: "Rechazada" },
                        entregada: { color: "text-blue-600", bg: "bg-blue-50", label: "Entregada" },
                      }[request.status]

                      if (!statusConfig) return null

                      return (
                        <Card key={request.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold">{request.organizationName}</h3>
                                <p className="text-sm text-gray-600">
                                  Solicita: {material?.name || 'Material no encontrado'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{request.message}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                  <span>Cantidad: {request.requestedQuantity} {material?.unit || 'unidades'}</span>
                                  <span>•</span>
                                  <span className={`font-medium ${statusConfig.color}`}>
                                    {statusConfig.label}
                                  </span>
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                  Solicitado el {new Date(request.requestDate).toLocaleDateString()}
                                  {request.responseDate && (
                                    <span> • Respondido el {new Date(request.responseDate).toLocaleDateString()}</span>
                                  )}
                                  {request.pickupDate && (
                                    <span> • Recogido el {new Date(request.pickupDate).toLocaleDateString()}</span>
                                  )}
                                </p>
                              </div>
                              
                              <div className="flex gap-2 ml-4">
                                {request.status === "pendiente" && (
                                  <>
                                    <Button size="sm" variant="default">
                                      Aprobar
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Rechazar
                                    </Button>
                                  </>
                                )}
                                
                                {request.status === "entregada" && (
                                  <Button 
                                    size="sm" 
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={() => {
                                      // Aquí iría la lógica para generar el remito
                                      alert(`Generando remito de entrega para ${material?.name} - ${request.organizationName}`)
                                    }}
                                  >
                                    Generar Remito
                                  </Button>
                                )}
                              </div>
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
                  <h2 className="text-2xl font-bold mb-4">Impacto Social</h2>
                  <p className="text-gray-600 mb-6">
                    Descubre cómo tus donaciones están transformando vidas y cuidando el medio ambiente
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Impacto Ambiental</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>CO₂ Evitado</span>
                          <span className="font-semibold text-green-600">2.5 toneladas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Residuos Evitados</span>
                          <span className="font-semibold text-green-600">15 m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Materiales Reutilizados</span>
                          <span className="font-semibold text-green-600">{stats.completedDonations}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Impacto Social</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>ONGs Beneficiadas</span>
                          <span className="font-semibold text-blue-600">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Proyectos Apoyados</span>
                          <span className="font-semibold text-blue-600">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Familias Beneficiadas</span>
                          <span className="font-semibold text-blue-600">45</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Material donado</p>
                      <p className="text-gray-600">Cemento Portland a Fundación Hogar</p>
                      <p className="text-xs text-gray-400">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Nueva solicitud</p>
                      <p className="text-gray-600">ONG Construir solicita ladrillos</p>
                      <p className="text-xs text-gray-400">Hace 4 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Material agregado</p>
                      <p className="text-gray-600">Tubería PVC publicada</p>
                      <p className="text-xs text-gray-400">Ayer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
