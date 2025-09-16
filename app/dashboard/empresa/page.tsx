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
import { DashboardHeader } from "@/components/dashboard-header"
import { MaterialCard } from "@/components/material-card"
import { RequestsList } from "@/components/requests-list"
import { ActivityFeed } from "@/components/activity-feed"
import { ImpactDashboard } from "@/components/charts/impact-dashboard"

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
    setMaterials(mockMaterials.filter((m) => m.companyId === currentUser.id))
    // Filtrar solicitudes para materiales de esta empresa
    const empresaMaterialIds = mockMaterials.filter((m) => m.companyId === currentUser.id).map((m) => m.id)
    setRequests(mockRequests.filter((r) => empresaMaterialIds.includes(r.materialId)))
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

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
                      <MaterialCard
                        key={material.id}
                        material={material}
                        showActions={true}
                        onEdit={(id) => (window.location.href = `/dashboard/empresa/editar-material/${id}`)}
                        onDelete={(id) => {
                          setMaterials(materials.filter((m) => m.id !== id))
                        }}
                      />
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

                <RequestsList
                  requests={requests}
                  materials={materials}
                  onUpdateRequest={(requestId, status) => {
                    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status } : r)))
                  }}
                />
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Impacto Social de EcoConstruye</h2>
                  <p className="text-gray-600 mb-6">
                    Descubre cómo tus donaciones están transformando vidas y cuidando el medio ambiente
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
    </div>
  )
}
