import type { DonationRequest, Material } from "./types"

// Simulación de base de datos en memoria
const requests: DonationRequest[] = [
  {
    id: "1",
    materialId: "1",
    ongId: "ong1",
    ongName: "Fundación Hábitat",
    requestedQuantity: 20,
    message: "Necesitamos cemento para construcción de viviendas sociales en Villa 31",
    status: "pendiente",
    requestDate: "2024-01-14",
  },
  {
    id: "2",
    materialId: "2",
    ongId: "ong2",
    ongName: "Techo Argentina",
    requestedQuantity: 500,
    message: "Para construcción de casas de emergencia en La Matanza",
    status: "aprobada",
    requestDate: "2024-01-13",
    responseDate: "2024-01-14",
    pickupDate: "2024-01-18",
  },
]

const materials: Material[] = [
  {
    id: "1",
    name: "Cemento Portland",
    category: "cemento",
    quantity: 50,
    unit: "bolsas",
    condition: "nuevo",
    description: "Cemento Portland tipo I, ideal para construcción general",
    location: "Zona Norte - San Isidro",
    coordinates: { lat: -34.4708, lng: -58.5109 },
    companyId: "empresa1",
    companyName: "Constructora Norte SA",
    availableFrom: "2024-01-15",
    status: "disponible",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Ladrillos Comunes",
    category: "ladrillos",
    quantity: 2000,
    unit: "unidades",
    condition: "nuevo",
    description: "Ladrillos comunes 6x12x25cm, primera calidad",
    location: "Zona Oeste - Morón",
    coordinates: { lat: -34.6534, lng: -58.6198 },
    companyId: "empresa1",
    companyName: "Constructora Norte SA",
    availableFrom: "2024-01-20",
    status: "disponible",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Hierro para Construcción",
    category: "hierro",
    quantity: 500,
    unit: "kg",
    condition: "nuevo",
    description: "Barras de hierro de 8mm y 12mm para estructura",
    location: "Zona Sur - Avellaneda",
    coordinates: { lat: -34.6637, lng: -58.3623 },
    companyId: "empresa2",
    companyName: "Hierros del Sur",
    availableFrom: "2024-01-18",
    status: "disponible",
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    name: "Cerámicos para Piso",
    category: "ceramicos",
    quantity: 100,
    unit: "m2",
    condition: "usado-excelente",
    description: "Cerámicos 30x30cm color beige, sobrante de obra",
    location: "Zona Centro - CABA",
    coordinates: { lat: -34.6118, lng: -58.396 },
    companyId: "empresa3",
    companyName: "Cerámicos Premium",
    availableFrom: "2024-01-22",
    status: "disponible",
    createdAt: "2024-01-20",
  },
]

export class RequestService {
  // Obtener todas las solicitudes
  static getAllRequests(): DonationRequest[] {
    return requests
  }

  // Obtener solicitudes por empresa
  static getRequestsByCompany(companyId: string): DonationRequest[] {
    const companyMaterials = materials.filter((m) => m.companyId === companyId)
    const materialIds = companyMaterials.map((m) => m.id)
    return requests.filter((r) => materialIds.includes(r.materialId))
  }

  // Obtener solicitudes por ONG
  static getRequestsByONG(ongId: string): DonationRequest[] {
    return requests.filter((r) => r.ongId === ongId)
  }

  // Crear nueva solicitud
  static createRequest(request: Omit<DonationRequest, "id" | "requestDate">): DonationRequest {
    const newRequest: DonationRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split("T")[0],
    }
    requests.push(newRequest)
    return newRequest
  }

  // Actualizar estado de solicitud
  static updateRequestStatus(
    requestId: string,
    status: DonationRequest["status"],
    responseDate?: string,
    pickupDate?: string,
    volunteerAssigned?: string,
  ): DonationRequest | null {
    const requestIndex = requests.findIndex((r) => r.id === requestId)
    if (requestIndex === -1) return null

    requests[requestIndex] = {
      ...requests[requestIndex],
      status,
      responseDate: responseDate || requests[requestIndex].responseDate,
      pickupDate: pickupDate || requests[requestIndex].pickupDate,
      volunteerAssigned: volunteerAssigned || requests[requestIndex].volunteerAssigned,
    }

    // Si se aprueba la solicitud, actualizar el estado del material
    if (status === "aprobada") {
      const materialIndex = materials.findIndex((m) => m.id === requests[requestIndex].materialId)
      if (materialIndex !== -1) {
        materials[materialIndex].status = "reservado"
      }
    }

    // Si se completa la donación, actualizar el estado del material
    if (status === "completada") {
      const materialIndex = materials.findIndex((m) => m.id === requests[requestIndex].materialId)
      if (materialIndex !== -1) {
        const material = materials[materialIndex]
        const request = requests[requestIndex]

        // Reducir la cantidad disponible
        material.quantity -= request.requestedQuantity

        // Si no queda cantidad, marcar como donado
        if (material.quantity <= 0) {
          material.status = "donado"
        } else {
          material.status = "disponible"
        }
      }
    }

    return requests[requestIndex]
  }

  // Obtener todos los materiales
  static getAllMaterials(): Material[] {
    return materials
  }

  // Obtener materiales disponibles
  static getAvailableMaterials(): Material[] {
    return materials.filter((m) => m.status === "disponible")
  }

  // Obtener materiales por empresa
  static getMaterialsByCompany(companyId: string): Material[] {
    return materials.filter((m) => m.companyId === companyId)
  }

  // Agregar nuevo material
  static addMaterial(material: Omit<Material, "id" | "createdAt">): Material {
    const newMaterial: Material = {
      ...material,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    materials.push(newMaterial)
    return newMaterial
  }

  // Obtener material por ID
  static getMaterialById(materialId: string): Material | null {
    return materials.find((m) => m.id === materialId) || null
  }

  // Obtener estadísticas
  static getStats() {
    return {
      totalMaterials: materials.length,
      availableMaterials: materials.filter((m) => m.status === "disponible").length,
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pendiente").length,
      approvedRequests: requests.filter((r) => r.status === "aprobada").length,
      completedDonations: requests.filter((r) => r.status === "completada").length,
    }
  }

  // Notificaciones para empresas
  static getCompanyNotifications(companyId: string): Array<{
    id: string
    type: "new_request" | "pickup_reminder"
    message: string
    date: string
    requestId?: string
  }> {
    const companyRequests = this.getRequestsByCompany(companyId)
    const notifications = []

    // Nuevas solicitudes pendientes
    const pendingRequests = companyRequests.filter((r) => r.status === "pendiente")
    for (const request of pendingRequests) {
      const material = this.getMaterialById(request.materialId)
      notifications.push({
        id: `new_${request.id}`,
        type: "new_request" as const,
        message: `Nueva solicitud de ${request.ongName} para ${material?.name}`,
        date: request.requestDate,
        requestId: request.id,
      })
    }

    // Recordatorios de retiro
    const approvedRequests = companyRequests.filter((r) => r.status === "aprobada" && r.pickupDate)
    for (const request of approvedRequests) {
      const material = this.getMaterialById(request.materialId)
      notifications.push({
        id: `pickup_${request.id}`,
        type: "pickup_reminder" as const,
        message: `Retiro programado: ${material?.name} - ${request.pickupDate}`,
        date: request.pickupDate!,
        requestId: request.id,
      })
    }

    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Notificaciones para ONGs
  static getONGNotifications(ongId: string): Array<{
    id: string
    type: "request_approved" | "request_rejected" | "pickup_scheduled"
    message: string
    date: string
    requestId?: string
  }> {
    const ongRequests = this.getRequestsByONG(ongId)
    const notifications = []

    // Solicitudes aprobadas
    const approvedRequests = ongRequests.filter((r) => r.status === "aprobada" && r.responseDate)
    for (const request of approvedRequests) {
      const material = this.getMaterialById(request.materialId)
      notifications.push({
        id: `approved_${request.id}`,
        type: "request_approved" as const,
        message: `Solicitud aprobada: ${material?.name}`,
        date: request.responseDate!,
        requestId: request.id,
      })
    }

    // Solicitudes rechazadas
    const rejectedRequests = ongRequests.filter((r) => r.status === "rechazada" && r.responseDate)
    for (const request of rejectedRequests) {
      const material = this.getMaterialById(request.materialId)
      notifications.push({
        id: `rejected_${request.id}`,
        type: "request_rejected" as const,
        message: `Solicitud rechazada: ${material?.name}`,
        date: request.responseDate!,
        requestId: request.id,
      })
    }

    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}
