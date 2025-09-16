"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequestService } from "@/lib/request-service"
import { NotificationCenter } from "@/components/notification-center"
import Link from "next/link"
import Image from "next/image"
import { DashboardHeader } from "@/components/dashboard-header"

const ProjectsMap = ({ projects, selectedProjects }: { projects: any[]; selectedProjects: string[] }) => {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg border overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mapa de Donaciones - Buenos Aires</h3>
          <p className="text-gray-600 mb-4">Visualización de todas las donaciones que necesitan voluntarios</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {projects.slice(0, 4).map((project, index) => (
              <div
                key={project.id}
                className={`p-2 rounded border ${selectedProjects.includes(project.id) ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-300"}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${selectedProjects.includes(project.id) ? "bg-red-500" : "bg-blue-500"}`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium text-xs">{project.title}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{project.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VoluntarioDashboard() {
  const [availableRequests, setAvailableRequests] = useState<any[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [projectContributions, setProjectContributions] = useState<Record<string, { tasks: string[]; hours: number }>>(
    {},
  )
  const [workedHours, setWorkedHours] = useState<
    Record<string, { date: string; hours: number; description: string; tasks: string[] }[]>
  >({})
  const [newHourEntry, setNewHourEntry] = useState<
    Record<string, { date: string; hours: string; description: string; tasks: string[] }>
  >({})
  const [notifications, setNotifications] = useState<any[]>([])

  const volunteerId = "voluntario1" // En una app real, esto vendría del contexto de autenticación

  useEffect(() => {
    const approvedRequests = RequestService.getAllRequests().filter((r) => r.status === "aprobada")
    const requestsWithMaterials = approvedRequests.map((request) => {
      const material = RequestService.getMaterialById(request.materialId)
      return {
        id: request.id,
        title: `Donación: ${material?.name} - ${request.ongName}`,
        description: `${request.message} - Cantidad: ${request.requestedQuantity} ${material?.unit}`,
        location: material?.location || "Buenos Aires",
        coordinates: material?.coordinates || { lat: -34.6118, lng: -58.396 },
        ongName: request.ongName,
        materialsNeeded: [material?.name || "Material"],
        volunteersNeeded: 3,
        volunteerTypesNeeded: [
          "Conductores con registro profesional",
          "Operarios de carga y descarga",
          "Coordinadores logísticos",
        ],
        category: "donacion",
        urgency: "alta",
        startDate: request.pickupDate || "2024-02-15",
        estimatedDuration: "1 día",
        requestId: request.id,
        materialId: request.materialId,
        companyName: material?.companyName,
      }
    })

    setAvailableRequests(requestsWithMaterials)
  }, [])

  const handleProjectChange = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects((prev) => [...prev, projectId])
      setProjectContributions((prev) => ({
        ...prev,
        [projectId]: { tasks: [], hours: 0 },
      }))

      RequestService.updateRequestStatus(projectId, "aprobada", undefined, undefined, volunteerId)
    } else {
      setSelectedProjects((prev) => prev.filter((p) => p !== projectId))
      setProjectContributions((prev) => {
        const newContributions = { ...prev }
        delete newContributions[projectId]
        return newContributions
      })
    }
  }

  const handleTaskContributionChange = (projectId: string, task: string, checked: boolean) => {
    setProjectContributions((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        tasks: checked
          ? [...(prev[projectId]?.tasks || []), task]
          : (prev[projectId]?.tasks || []).filter((t) => t !== task),
      },
    }))
  }

  const handleHoursChange = (projectId: string, hours: number) => {
    setProjectContributions((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        hours: hours,
      },
    }))
  }

  const addWorkedHours = (projectId: string) => {
    const entry = newHourEntry[projectId]
    if (!entry || !entry.date || !entry.hours || entry.tasks.length === 0) return

    setWorkedHours((prev) => ({
      ...prev,
      [projectId]: [
        ...(prev[projectId] || []),
        {
          date: entry.date,
          hours: Number(entry.hours),
          description: entry.description,
          tasks: [...entry.tasks],
        },
      ],
    }))

    setNewHourEntry((prev) => ({
      ...prev,
      [projectId]: { date: "", hours: "", description: "", tasks: [] },
    }))
  }

  const handleHourEntryChange = (projectId: string, field: string, value: any) => {
    setNewHourEntry((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }))
  }

  const getTotalHours = (projectId: string) => {
    return workedHours[projectId]?.reduce((total, entry) => total + entry.hours, 0) || 0
  }

  const completeProject = (projectId: string) => {
    RequestService.updateRequestStatus(projectId, "completada")
    setAvailableRequests((prev) => prev.filter((p) => p.id !== projectId))
    setSelectedProjects((prev) => prev.filter((p) => p !== projectId))
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "donacion":
        return "📦"
      case "transporte":
        return "🚛"
      case "coordinacion":
        return "📋"
      default:
        return "📋"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={{ id: volunteerId, name: "Voluntario", role: "voluntario", email: "voluntario@demo.com" }} />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Voluntario</h1>
            <p className="text-gray-600">Ayuda con el transporte y coordinación de donaciones</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedProjects.length}</div>
                  <div className="text-sm text-gray-600">Donaciones Activas</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Object.values(workedHours)
                      .flat()
                      .reduce((total, entry) => total + entry.hours, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Horas Totales</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{Object.values(workedHours).flat().length}</div>
                  <div className="text-sm text-gray-600">Actividades Registradas</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{availableRequests.length}</div>
                  <div className="text-sm text-gray-600">Donaciones Disponibles</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🗺️ Mapa de Donaciones - Mi Zona</CardTitle>
              <CardDescription>
                Visualiza todas las donaciones aprobadas que necesitan voluntarios. Los marcadores rojos son donaciones
                que seleccionaste.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsMap projects={availableRequests} selectedProjects={selectedProjects} />
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Donaciones disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Donaciones asignadas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">Donaciones Disponibles</TabsTrigger>
              <TabsTrigger value="my-projects">Mis Donaciones</TabsTrigger>
              <TabsTrigger value="hours">Registro de Horas</TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">📦 Donaciones Aprobadas</CardTitle>
                  <CardDescription>
                    Estas donaciones ya fueron aprobadas por las empresas y necesitan voluntarios para el transporte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {availableRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-4">📭</div>
                        <p>No hay donaciones disponibles en este momento</p>
                        <p className="text-sm">Las donaciones aparecerán aquí cuando las empresas las aprueben</p>
                      </div>
                    ) : (
                      availableRequests.map((project, index) => (
                        <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={project.id}
                              checked={selectedProjects.includes(project.id)}
                              onCheckedChange={(checked) => handleProjectChange(project.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getCategoryIcon(project.category)}</span>
                                <Badge variant="outline" className="text-xs">
                                  #{index + 1}
                                </Badge>
                                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                                <Badge className={getUrgencyColor(project.urgency)}>{project.urgency}</Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{project.description}</p>

                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-700">Voluntarios necesarios:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.volunteerTypesNeeded.map((type: string) => (
                                    <Badge
                                      key={type}
                                      variant="secondary"
                                      className="text-xs bg-orange-100 text-orange-800"
                                    >
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                                <span>📍 {project.location}</span>
                                <span>🏢 {project.ongName}</span>
                                <span>🏭 {project.companyName}</span>
                                <span>📅 {project.startDate}</span>
                                <span>⏱️ {project.estimatedDuration}</span>
                              </div>

                              <div className="mt-3">
                                <span className="text-xs text-gray-500">Materiales a transportar: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.materialsNeeded.map((material: string) => (
                                    <Badge key={material} variant="outline" className="text-xs">
                                      {material}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {selectedProjects.includes(project.id) && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <h4 className="font-medium text-blue-900 mb-3">
                                    ¿En qué puedes ayudar en esta donación?
                                  </h4>

                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium text-blue-800">Tareas específicas:</Label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                        {[
                                          "Carga de materiales",
                                          "Descarga de materiales",
                                          "Transporte en vehículo propio",
                                          "Coordinación con empresa donante",
                                          "Coordinación con ONG receptora",
                                          "Verificación de inventario",
                                          "Documentación de entrega",
                                          "Supervisión de calidad",
                                        ].map((task) => (
                                          <div key={task} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`${project.id}-${task}`}
                                              checked={projectContributions[project.id]?.tasks?.includes(task) || false}
                                              onCheckedChange={(checked) =>
                                                handleTaskContributionChange(project.id, task, checked as boolean)
                                              }
                                            />
                                            <Label htmlFor={`${project.id}-${task}`} className="text-xs">
                                              {task}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <Label
                                        htmlFor={`hours-${project.id}`}
                                        className="text-sm font-medium text-blue-800"
                                      >
                                        Horas que puedes destinar:
                                      </Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Input
                                          id={`hours-${project.id}`}
                                          type="number"
                                          min="1"
                                          max="12"
                                          placeholder="0"
                                          value={projectContributions[project.id]?.hours || ""}
                                          onChange={(e) =>
                                            handleHoursChange(project.id, Number.parseInt(e.target.value) || 0)
                                          }
                                          className="w-20"
                                        />
                                        <span className="text-sm text-gray-600">horas para esta donación</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-projects">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Donaciones Activas</CardTitle>
                  <CardDescription>Gestiona las donaciones donde estás ayudando</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📋</div>
                      <p>No tienes donaciones asignadas aún</p>
                      <p className="text-sm">Ve a "Donaciones Disponibles" para seleccionar algunas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedProjects.map((projectId) => {
                        const project = availableRequests.find((p) => p.id === projectId)
                        if (!project) return null

                        return (
                          <div key={projectId} className="border rounded-lg p-4 bg-green-50">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                                <p className="text-sm text-gray-600">📍 {project.location}</p>
                                <p className="text-sm text-gray-600">
                                  🏭 {project.companyName} → 🏢 {project.ongName}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">{getTotalHours(projectId)}h</div>
                                <div className="text-xs text-gray-500">horas trabajadas</div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <span className="text-sm font-medium">Mis tareas asignadas:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {projectContributions[projectId]?.tasks?.map((task) => (
                                  <Badge key={task} variant="secondary" className="text-xs">
                                    {task}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Ver Detalles
                              </Button>
                              <Button size="sm" variant="outline">
                                Contactar Coordinador
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => completeProject(projectId)}
                              >
                                Marcar como Completada
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Horas Trabajadas</CardTitle>
                  <CardDescription>Registra las horas que trabajaste en cada donación</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">⏰</div>
                      <p>Primero selecciona algunas donaciones para registrar horas</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedProjects.map((projectId) => {
                        const project = availableRequests.find((p) => p.id === projectId)
                        if (!project) return null

                        return (
                          <div key={projectId} className="border rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">{project.title}</h3>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                              <h4 className="font-medium mb-3">Registrar nueva actividad</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`date-${projectId}`}>Fecha</Label>
                                  <Input
                                    id={`date-${projectId}`}
                                    type="date"
                                    value={newHourEntry[projectId]?.date || ""}
                                    onChange={(e) => handleHourEntryChange(projectId, "date", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`hours-worked-${projectId}`}>Horas trabajadas</Label>
                                  <Input
                                    id={`hours-worked-${projectId}`}
                                    type="number"
                                    min="0.5"
                                    step="0.5"
                                    placeholder="0"
                                    value={newHourEntry[projectId]?.hours || ""}
                                    onChange={(e) => handleHourEntryChange(projectId, "hours", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="mt-4">
                                <Label>Tareas realizadas</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {projectContributions[projectId]?.tasks?.map((task) => (
                                    <div key={task} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`worked-${projectId}-${task}`}
                                        checked={newHourEntry[projectId]?.tasks?.includes(task) || false}
                                        onCheckedChange={(checked) => {
                                          const currentTasks = newHourEntry[projectId]?.tasks || []
                                          const newTasks = checked
                                            ? [...currentTasks, task]
                                            : currentTasks.filter((t) => t !== task)
                                          handleHourEntryChange(projectId, "tasks", newTasks)
                                        }}
                                      />
                                      <Label htmlFor={`worked-${projectId}-${task}`} className="text-sm">
                                        {task}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-4">
                                <Label htmlFor={`description-${projectId}`}>Descripción de la actividad</Label>
                                <Textarea
                                  id={`description-${projectId}`}
                                  placeholder="Describe brevemente lo que hiciste..."
                                  value={newHourEntry[projectId]?.description || ""}
                                  onChange={(e) => handleHourEntryChange(projectId, "description", e.target.value)}
                                />
                              </div>

                              <Button
                                className="mt-4"
                                onClick={() => addWorkedHours(projectId)}
                                disabled={
                                  !newHourEntry[projectId]?.date ||
                                  !newHourEntry[projectId]?.hours ||
                                  !newHourEntry[projectId]?.tasks?.length
                                }
                              >
                                Registrar Horas
                              </Button>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Historial de actividades</h4>
                              {workedHours[projectId]?.length ? (
                                <div className="space-y-2">
                                  {workedHours[projectId].map((entry, index) => (
                                    <div key={index} className="border rounded p-3 bg-white">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm font-medium">{entry.date}</div>
                                        <div className="text-sm font-bold text-green-600">{entry.hours}h</div>
                                      </div>
                                      <div className="text-sm text-gray-600 mb-2">{entry.description}</div>
                                      <div className="flex flex-wrap gap-1">
                                        {entry.tasks.map((task) => (
                                          <Badge key={task} variant="outline" className="text-xs">
                                            {task}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">No hay actividades registradas aún</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
