"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Plus, Eye } from "lucide-react"
import { getShipments, type Shipment } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  picked_up: "bg-blue-100 text-blue-800",
  in_transit: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  exception: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  exception: "Exception",
  cancelled: "Cancelled",
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadShipments = async () => {
      if (user) {
        try {
          const data = await getShipments(user.id)
          setShipments(data)
          setFilteredShipments(data)
        } catch (error) {
          console.error("Error loading shipments:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadShipments()
  }, [user])

  useEffect(() => {
    const filtered = shipments.filter(
      (shipment) =>
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.recipientAddress.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredShipments(filtered)
  }, [searchTerm, shipments])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipments</h1>
              <p className="text-gray-600">Manage and track all your shipments</p>
            </div>
            <Link href="/dashboard/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Shipments</CardTitle>
              <CardDescription>Find shipments by tracking number, recipient, or address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by tracking number, recipient name, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading shipments...</p>
              </CardContent>
            </Card>
          ) : filteredShipments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No shipments found" : "No shipments yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first shipment to get started"}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Shipment
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{shipment.trackingNumber}</h3>
                          <Badge className={statusColors[shipment.status]}>{statusLabels[shipment.status]}</Badge>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">To:</span> {shipment.recipientName}
                          </p>
                          <p>
                            <span className="font-medium">Service:</span>{" "}
                            {shipment.serviceType.charAt(0).toUpperCase() + shipment.serviceType.slice(1)}
                          </p>
                          <p>
                            <span className="font-medium">Weight:</span> {shipment.weight} lbs
                          </p>
                          <p>
                            <span className="font-medium">Cost:</span> {formatCurrency(shipment.totalCost)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Address:</span> {shipment.recipientAddress}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {shipment.status === "delivered" && shipment.actualDelivery
                              ? `Delivered ${formatDate(shipment.actualDelivery)}`
                              : `Est. Delivery ${formatDate(shipment.estimatedDelivery)}`}
                          </p>
                          <p className="text-xs text-gray-500">Created {formatDate(shipment.createdAt)}</p>
                        </div>
                        <Link href={`/tracking?number=${shipment.trackingNumber}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Track
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
