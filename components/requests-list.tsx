"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, User, MapPin, Package } from "lucide-react"
import type { DonationRequest, Material } from "@/lib/types"

interface RequestsListProps {
  requests: DonationRequest[]
  materials: Material[]
  onUpdateRequest: (requestId: string, status: "aprobada" | "rechazada") => void
}

export function RequestsList({ requests, materials, onUpdateRequest }: RequestsListProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pendiente":
        return {
          icon: Clock,
          color: "text-orange-600",
          bg: "bg-orange-50",
          label: "Pendiente"
        }
      case "aprobada":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
          label: "Aprobada"
        }
      case "rechazada":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          label: "Rechazada"
        }
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bg: "bg-gray-50",
          label: "Desconocido"
        }
    }
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
          <p className="text-gray-600 text-center">
            Las solicitudes de ONGs aparecerán aquí cuando las envíen
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const material = materials.find(m => m.id === request.materialId)
        if (!material) return null

        const statusConfig = getStatusConfig(request.status)
        const StatusIcon = statusConfig.icon

        return (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{request.ongName}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                  <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                  <span className={`text-sm font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Mensaje de la ONG:</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                    {request.message}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>Cantidad solicitada: {request.requestedQuantity} {material.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{material.location}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Solicitud enviada el {new Date(request.requestDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>

                {request.status === "pendiente" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => onUpdateRequest(request.id, "aprobada")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateRequest(request.id, "rechazada")}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}