"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Calendar, User } from "lucide-react"
import type { Material } from "@/lib/types"

interface RequestMaterialDialogProps {
  material: Material
  open: boolean
  onClose: () => void
  onSubmit: (materialId: string, message: string) => void
}

export function RequestMaterialDialog({ material, open, onClose, onSubmit }: RequestMaterialDialogProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    try {
      await onSubmit(material.id, message)
      setMessage("")
      onClose()
    } catch (error) {
      console.error("Error al enviar solicitud:", error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Material</DialogTitle>
          <DialogDescription>
            Envía una solicitud para este material. La empresa revisará tu petición.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del material */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{material.name}</h3>
              <Badge className={getConditionColor(material.condition)}>
                {material.condition}
              </Badge>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{material.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span>{material.quantity} {material.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{material.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Disponible desde {new Date(material.availableFrom).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{material.companyName}</span>
              </div>
            </div>
          </div>

          {/* Formulario de solicitud */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje para la empresa *</Label>
              <Textarea
                id="message"
                placeholder="Explica brevemente para qué necesitas este material, cuánto requieres, y cuándo podrías recogerlo..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-gray-500">
                Incluye detalles sobre tu proyecto, la cantidad necesaria y disponibilidad para coordinar la recogida.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !message.trim()} className="flex-1">
                {loading ? "Enviando..." : "Enviar Solicitud"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}