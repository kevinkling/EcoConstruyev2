export interface User {
  id: string
  email: string
  role: "empresa" | "ong" | "voluntario"
  name: string
}

export interface Project {
  id: string
  title: string
  description: string
  location: string
  coordinates: { lat: number; lng: number }
  ongName: string
  materialsNeeded: string[]
  volunteersNeeded: number
  volunteerTypesNeeded: string[]
  category: "construccion" | "transporte" | "organizacion" | "tecnico"
  urgency: "baja" | "media" | "alta"
  startDate: string
  estimatedDuration: string
}

export interface VolunteerProfile extends User {
  skills: string[]
  availability: string[]
  location: string
  selectedProjects: string[]
  experience: string
}

export interface Material {
  id: string
  name: string
  category:
    | "cemento"
    | "ladrillos"
    | "hierro"
    | "madera"
    | "ceramicos"
    | "sanitarios"
    | "electricidad"
    | "pintura"
    | "otros"
  quantity: number
  unit: "kg" | "m2" | "m3" | "unidades" | "bolsas" | "metros"
  condition: "nuevo" | "usado-excelente" | "usado-bueno" | "usado-regular"
  description: string
  images?: string[]
  location: string
  coordinates: { lat: number; lng: number }
  companyId: string
  companyName: string
  availableFrom: string
  expirationDate?: string
  status: "disponible" | "reservado" | "donado"
  createdAt: string
}

export interface CompanyProfile extends User {
  companyName: string
  cuit: string
  address: string
  phone: string
  contactPerson: string
  materialsPublished: Material[]
  donationsCompleted: number
}

export interface DonationRequest {
  id: string
  materialId: string
  ongId: string
  ongName: string
  requestedQuantity: number
  message: string
  status: "pendiente" | "aprobada" | "rechazada" | "completada"
  requestDate: string
  responseDate?: string
  pickupDate?: string
  volunteerAssigned?: string
}
