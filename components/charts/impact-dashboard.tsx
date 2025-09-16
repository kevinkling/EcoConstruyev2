"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

// Datos mock para el dashboard de impacto
const materialStats = [
  { name: "Ladrillos", cantidad: 12500, impacto: "350 m²" },
  { name: "Cemento", cantidad: 850, impacto: "45 toneladas" },
  { name: "Madera", cantidad: 2100, impacto: "180 m³" },
  { name: "Metal", cantidad: 680, impacto: "25 toneladas" },
  { name: "Otros", cantidad: 1200, impacto: "Varios" },
]

const impactData = [
  { name: "CO₂ Ahorrado", value: 1250, unit: "toneladas" },
  { name: "Viviendas Construidas", value: 89, unit: "unidades" },
  { name: "Familias Beneficiadas", value: 356, unit: "familias" },
  { name: "Empleos Generados", value: 142, unit: "empleos" },
]

const monthlyData = [
  { mes: "Ene", donaciones: 12, materiales: 45 },
  { mes: "Feb", donaciones: 18, materiales: 52 },
  { mes: "Mar", donaciones: 24, materiales: 78 },
  { mes: "Abr", donaciones: 31, materiales: 89 },
  { mes: "May", donaciones: 28, materiales: 67 },
  { mes: "Jun", donaciones: 35, materiales: 95 },
]

const pieData = [
  { name: "Materiales Donados", value: 65, color: "#10b981" },
  { name: "En Proceso", value: 25, color: "#f59e0b" },
  { name: "Disponibles", value: 10, color: "#3b82f6" },
]

export function ImpactDashboard() {
  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactData.map((item) => (
          <Card key={item.name}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{item.value.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{item.unit}</div>
                <div className="text-xs text-gray-500 mt-1">{item.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Materiales por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Materiales Donados por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico circular - Estado de donaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de las Donaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de línea - Evolución mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución Mensual de Donaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="donaciones" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="materiales" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Impacto ambiental */}
      <Card>
        <CardHeader>
          <CardTitle>Impacto Ambiental y Social</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl mb-2">🌱</div>
              <div className="text-2xl font-bold text-green-600">1,250</div>
              <div className="text-sm text-gray-600">Toneladas de CO₂ ahorradas</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-2">🏠</div>
              <div className="text-2xl font-bold text-blue-600">89</div>
              <div className="text-sm text-gray-600">Viviendas construidas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-2xl font-bold text-purple-600">356</div>
              <div className="text-sm text-gray-600">Familias beneficiadas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}