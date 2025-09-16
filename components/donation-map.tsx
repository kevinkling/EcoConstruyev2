"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Filter } from "lucide-react"

// Datos de ejemplo para el mapa
const donationPoints = [
  {
    id: "1",
    name: "Cemento Portland - 30 bolsas",
    company: "Constructora ABC",
    ong: "Fundación Hogar Esperanza",
    location: "Bogotá - Zona Norte",
    status: "completada",
    date: "2024-01-15",
    coordinates: { lat: 4.7110, lng: -74.0721 },
    type: "cemento"
  },
  {
    id: "2", 
    name: "Ladrillos cerámicos - 500 unidades",
    company: "Materiales del Valle",
    ong: "ONG Construyendo Futuro",
    location: "Medellín - El Poblado",
    status: "entregada",
    date: "2024-01-12",
    coordinates: { lat: 6.2442, lng: -75.5812 },
    type: "ladrillos"
  },
  {
    id: "3",
    name: "Tubería PVC - 200 metros",
    company: "Hidráulicos S.A.S",
    ong: "Asociación San José",
    location: "Cali - Norte",
    status: "aprobada",
    date: "2024-01-10",
    coordinates: { lat: 3.4516, lng: -76.5320 },
    type: "sanitarios"
  },
  {
    id: "4",
    name: "Vigas de madera - 20 unidades",
    company: "Maderas Colombia",
    ong: "Techo para Mi País",
    location: "Barranquilla - Centro",
    status: "pendiente",
    date: "2024-01-08",
    coordinates: { lat: 10.9639, lng: -74.7964 },
    type: "madera"
  }
]

export function DonationMap() {
  const [selectedFilter, setSelectedFilter] = useState<string>("todas")
  const [selectedPoint, setSelectedPoint] = useState<any>(null)

  const filteredPoints = selectedFilter === "todas" 
    ? donationPoints 
    : donationPoints.filter(point => point.status === selectedFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada": return "bg-blue-500"
      case "entregada": return "bg-green-500"
      case "aprobada": return "bg-yellow-500"
      case "pendiente": return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completada": return "Completada"
      case "entregada": return "Entregada"
      case "aprobada": return "Aprobada"
      case "pendiente": return "Pendiente"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrar por Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {["todas", "pendiente", "aprobada", "entregada", "completada"].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter === "todas" ? "Todas" : getStatusLabel(filter)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mapa Simulado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Donaciones - Colombia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 min-h-[400px] border-2 border-dashed border-gray-200">
            {/* Simulación de mapa de Colombia */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <Navigation className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Mapa Interactivo de Colombia</p>
                <p className="text-sm">Visualiza las donaciones en tiempo real</p>
              </div>
            </div>

            {/* Puntos de donación simulados */}
            {filteredPoints.map((point, index) => (
              <div
                key={point.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                style={{
                  // Posiciones simuladas en el "mapa"
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`
                }}
                onClick={() => setSelectedPoint(point)}
              >
                <div className={`w-4 h-4 rounded-full ${getStatusColor(point.status)} border-2 border-white shadow-lg animate-pulse`}></div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  {point.location}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de donaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Donaciones en tu Zona ({filteredPoints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPoints.map((point) => (
              <div
                key={point.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPoint?.id === point.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedPoint(point)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{point.name}</h4>
                  <Badge variant={
                    point.status === "completada" ? "default" :
                    point.status === "entregada" ? "secondary" :
                    point.status === "aprobada" ? "outline" : "destructive"
                  }>
                    {getStatusLabel(point.status)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Empresa:</strong> {point.company}</p>
                  <p><strong>ONG:</strong> {point.ong}</p>
                  <p><strong>Ubicación:</strong> {point.location}</p>
                  <p><strong>Fecha:</strong> {new Date(point.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda del Mapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm">Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Aprobada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Entregada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Completada</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}