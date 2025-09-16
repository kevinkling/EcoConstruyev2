"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, Users, CheckCircle } from "lucide-react"
import type { User } from "@/lib/types"

interface ActivityFeedProps {
  user: User | null
  limit?: number
}

// Datos mock para el feed de actividad
const mockActivities = [
  {
    id: "1",
    type: "donation_completed",
    title: "Nueva donación completada",
    description: "Cemento Portland - 2 toneladas",
    time: "Hace 2 horas",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    id: "2",
    type: "material_available",
    title: "Nuevo material disponible",
    description: "Ladrillos cerámicos - Villa Crespo",
    time: "Hace 5 horas",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: "3",
    type: "transport_coordinated",
    title: "Transporte coordinado",
    description: "Voluntario asignado para entrega",
    time: "Ayer",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    id: "4",
    type: "request_approved",
    title: "Solicitud aprobada",
    description: "Vigas de madera - Fundación Construir",
    time: "Hace 2 días",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    id: "5",
    type: "new_ong_registered",
    title: "Nueva ONG registrada",
    description: "Hábitat para la Humanidad se unió",
    time: "Hace 3 días",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    id: "6",
    type: "material_reserved",
    title: "Material reservado",
    description: "Tubería PVC - 200 metros",
    time: "Hace 4 días",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: "7",
    type: "volunteer_joined",
    title: "Nuevo voluntario",
    description: "Carlos se unió como coordinador",
    time: "Hace 5 días",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    id: "8",
    type: "donation_completed",
    title: "Donación entregada",
    description: "Arena fina - 5 toneladas",
    time: "Hace 1 semana",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50"
  }
]

export function ActivityFeed({ user, limit = 6 }: ActivityFeedProps) {
  const activities = mockActivities.slice(0, limit)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div key={activity.id} className={`flex items-center gap-3 p-3 rounded-lg ${activity.bg}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bg}`}>
                  <IconComponent className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-gray-600 text-xs">{activity.description}</p>
                </div>
                <div className="text-gray-500 text-xs">{activity.time}</div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-center text-sm text-gray-500">
            Mostrando las últimas {activities.length} actividades
          </p>
        </div>
      </CardContent>
    </Card>
  )
}