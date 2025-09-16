"use client"

import { useEffect, useState } from "react"

interface LocationMapProps {
  address?: string
  city?: string
  coordinates?: { lat: number; lng: number }
  onLocationChange?: (location: { address: string; city: string; coordinates?: { lat: number; lng: number } }) => void
  showSearch?: boolean
  height?: string
}

export function LocationMap({ 
  address = "", 
  city = "", 
  coordinates, 
  onLocationChange,
  showSearch = false,
  height = "300px" 
}: LocationMapProps) {
  const [currentLocation, setCurrentLocation] = useState({
    address,
    city,
    coordinates
  })

  // Simular cambio de ubicación
  const handleLocationUpdate = (newAddress: string, newCity: string) => {
    const newLocation = {
      address: newAddress,
      city: newCity,
      coordinates: { lat: 40.4168 + Math.random() * 0.1, lng: -3.7038 + Math.random() * 0.1 }
    }
    setCurrentLocation(newLocation)
    onLocationChange?.(newLocation)
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Dirección"
            value={currentLocation.address}
            onChange={(e) => {
              const newLocation = { ...currentLocation, address: e.target.value }
              setCurrentLocation(newLocation)
              handleLocationUpdate(e.target.value, currentLocation.city)
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={currentLocation.city}
            onChange={(e) => {
              const newLocation = { ...currentLocation, city: e.target.value }
              setCurrentLocation(newLocation)
              handleLocationUpdate(currentLocation.address, e.target.value)
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      
      <div 
        className="w-full border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mapa Interactivo</h3>
          <p className="text-gray-600 mb-4">
            {currentLocation.address || currentLocation.city 
              ? `Ubicación: ${currentLocation.address || ""} ${currentLocation.city || ""}`.trim()
              : "Selecciona una ubicación en el mapa"
            }
          </p>
          <div className="text-sm text-gray-500">
            {currentLocation.coordinates && (
              <span>
                Coordenadas: {currentLocation.coordinates.lat.toFixed(4)}, {currentLocation.coordinates.lng.toFixed(4)}
              </span>
            )}
          </div>
          <div className="mt-4 p-3 bg-white/80 rounded-lg text-xs text-gray-600">
            Mapa simulado - En producción se integraría con Google Maps o Mapbox
          </div>
        </div>
      </div>
    </div>
  )
}