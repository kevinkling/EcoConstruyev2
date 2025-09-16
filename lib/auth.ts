import type { User } from "./types"

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    name: "Constructora ABC",
    email: "empresa@demo.com",
    role: "empresa",
  },
  {
    id: "2",
    name: "Fundación Hábitat",
    email: "ong@demo.com",
    role: "ong",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "voluntario@demo.com",
    role: "voluntario",
  },
]

export class AuthService {
  static getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  static async login(email: string, password: string): Promise<User | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // VALIDACIÓN TEMPORAL DESACTIVADA - ACEPTA CUALQUIER EMAIL Y CONTRASEÑA
    
    // Determinar el rol basado en el email
    let role: "empresa" | "ong" | "voluntario" = "empresa"
    
    if (email.toLowerCase().includes("ong") || email.toLowerCase().includes("fundacion")) {
      role = "ong"
    } else if (email.toLowerCase().includes("voluntario")) {
      role = "voluntario"
    } else if (email.toLowerCase().includes("empresa") || email.toLowerCase().includes("constructora")) {
      role = "empresa"
    }

    // Crear usuario temporal con cualquier email
    const user: User = {
      id: Date.now().toString(), // ID único basado en timestamp
      name: email.split('@')[0], // Usar la parte antes del @ como nombre
      email: email,
      role: role,
    }

    // Store user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    
    return user

    // CÓDIGO ORIGINAL COMENTADO:
    // Find user by email (password is always "demo123" for demo)
    // const user = mockUsers.find((u) => u.email === email)
    // if (user && password === "demo123") {
    //   if (typeof window !== "undefined") {
    //     localStorage.setItem("currentUser", JSON.stringify(user))
    //   }
    //   return user
    // }
    // throw new Error("Invalid credentials")
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }
}
