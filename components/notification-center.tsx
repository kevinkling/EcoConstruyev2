"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Notification {
  id: string
  type: string
  message: string
  date: string
  requestId?: string
}

interface NotificationCenterProps {
  notifications: Notification[]
  userType: "empresa" | "ong"
}

export function NotificationCenter({ notifications, userType }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_request":
        return "📋"
      case "pickup_reminder":
        return "🚚"
      case "request_approved":
        return "✅"
      case "request_rejected":
        return "❌"
      case "pickup_scheduled":
        return "📅"
      default:
        return "🔔"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_request":
        return "bg-blue-100 text-blue-800"
      case "pickup_reminder":
        return "bg-orange-100 text-orange-800"
      case "request_approved":
        return "bg-green-100 text-green-800"
      case "request_rejected":
        return "bg-red-100 text-red-800"
      case "pickup_scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          🔔 Notificaciones
          {notifications.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{notifications.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Centro de Notificaciones</DialogTitle>
          <DialogDescription>
            {notifications.length === 0
              ? "No tienes notificaciones nuevas"
              : `Tienes ${notifications.length} notificación${notifications.length > 1 ? "es" : ""}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500">No hay notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{notification.message}</p>
                        <Badge className={getNotificationColor(notification.type)}>
                          {notification.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{notification.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
