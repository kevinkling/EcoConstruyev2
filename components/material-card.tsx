"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Package, Edit, Trash2, Eye } from "lucide-react"
import type { Material } from "@/lib/types"

interface MaterialCardProps {
  material: Material
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function MaterialCard({ material, showActions = false, onEdit, onDelete, onView }: MaterialCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "nuevo":
        return "bg-green-100 text-green-800"
      case "usado-excelente":
        return "bg-blue-100 text-blue-800"
      case "usado-bueno":
        return "bg-yellow-100 text-yellow-800"
      case "usado-regular":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cemento":
        return "bg-gray-100 text-gray-800"
      case "ladrillos":
        return "bg-red-100 text-red-800"
      case "madera":
        return "bg-amber-100 text-amber-800"
      case "hierro":
        return "bg-slate-100 text-slate-800"
      case "ceramicos":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{material.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getConditionColor(material.condition)}>
              {material.condition}
            </Badge>
            <Badge className={getCategoryColor(material.category)}>
              {material.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-600 text-sm">{material.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>{material.quantity} {material.unit}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{material.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Disponible desde {new Date(material.availableFrom).toLocaleDateString()}</span>
          </div>

          <div className="text-sm">
            <span className="font-medium text-gray-700">Empresa: </span>
            <span className="text-gray-600">{material.companyName}</span>
          </div>

          {showActions && (
            <div className="flex gap-2 mt-4">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(material.id)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" onClick={() => onDelete(material.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              )}
            </div>
          )}

          {!showActions && onView && (
            <Button size="sm" className="w-full mt-4" onClick={() => onView(material.id)}>
              <Eye className="h-4 w-4 mr-1" />
              Solicitar Material
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}