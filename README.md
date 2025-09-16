# EcoConstruye - Documentación Técnica

## Descripción del Proyecto

EcoConstruye es una plataforma digital que conecta empresas constructoras, ONGs y voluntarios para promover proyectos de construcción sustentable y responsabilidad social. La aplicación facilita la colaboración entre diferentes actores para impulsar iniciativas de construcción ecológica.

## Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework de React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **Shadcn/ui** - Biblioteca de componentes UI

### Componentes UI Específicos
- **Button** - Componentes de botones personalizados
- **Card** - Componentes de tarjetas para contenido
- **Input** - Campos de entrada de formularios
- **Label** - Etiquetas para formularios

### Navegación y Routing
- **Next.js Router** - Sistema de navegación del lado del cliente
- **Link** - Componente para navegación optimizada

### Manejo de Imágenes
- **Next.js Image** - Optimización automática de imágenes

### Autenticación
- **AuthService** - Servicio personalizado de autenticación
- Sistema de roles múltiples (empresa, ong, voluntario)

## Arquitectura del Proyecto

### Estructura de Directorios
```
/app
  /login
    page.tsx         # Página de inicio de sesión
  /dashboard
    /empresa         # Dashboard para empresas
    /voluntario      # Dashboard para voluntarios
    /ong            # Dashboard para ONGs
/components
  /ui               # Componentes UI reutilizables
/lib
  auth.ts           # Servicio de autenticación
/public
  /images
    logo.webp       # Logo de la aplicación
```

### Patrones de Diseño Implementados

#### 1. Client-Side Rendering
- Uso de `"use client"` para componentes interactivos
- Manejo de estado con React hooks

#### 2. Sistema de Roles
- **Empresa**: Dashboard especializado para constructoras
- **ONG**: Panel para organizaciones no gubernamentales  
- **Voluntario**: Interfaz para voluntarios individuales

#### 3. Manejo de Estado
- `useState` para estado local del componente
- Estados separados para email, password, loading y errores

## Características Técnicas

### Autenticación y Autorización
- Login basado en email/contraseña
- Redirección automática según rol de usuario
- Manejo de errores de autenticación
- Cuentas de demo integradas para testing

### UX/UI
- Diseño responsive con Tailwind CSS
- Gradientes personalizados (green-50 to blue-50)
- Colores de marca personalizados (#f5924e)
- Loading states y feedback visual
- Accesibilidad con labels apropiados

### Optimización
- Lazy loading de imágenes con Next.js Image
- Prioridad en carga del logo (`priority` prop)
- TypeScript para detección temprana de errores

## Consideraciones de Desarrollo

### Seguridad
- Validación de formularios en cliente y servidor
- Manejo seguro de credenciales
- Protección contra ataques de fuerza bruta (implementar rate limiting)

### Performance
- Optimización de imágenes automática
- Code splitting con Next.js App Router
- CSS-in-JS con Tailwind para mejor performance

### Mantenibilidad
- Código TypeScript tipado
- Componentes reutilizables con Shadcn/ui
- Separación clara entre lógica de negocio y presentación

### Escalabilidad
- Arquitectura modular con separación por roles
- Servicios independientes (AuthService)
- Estructura preparada para crecimiento

## Configuración de Desarrollo

### Requisitos Previos
- Node.js 18+
- npm o yarn
- TypeScript 5+

### Variables de Entorno
```env
# Configurar según necesidades del proyecto
NEXT_PUBLIC_API_URL=
DATABASE_URL=
AUTH_SECRET=
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
npm run type-check   # Verificación de tipos
```

## Roadmap Técnico

### Próximas Implementaciones
- [ ] Integración con base de datos
- [ ] API REST/GraphQL
- [ ] Sistema de notificaciones
- [ ] Upload de archivos/documentos
- [ ] Chat en tiempo real
- [ ] Dashboard analytics
- [ ] PWA capabilities
- [ ] Tests unitarios e integración

### Mejoras de Seguridad
- [ ] 2FA (Two-Factor Authentication)
- [ ] Rate limiting
- [ ] Encriptación end-to-end
- [ ] Audit logs

## Contacto y Contribución

Para contribuir al proyecto o reportar issues, seguir las guías de contribución del repositorio.

---

*Documentación actualizada: Diciembre 2024*