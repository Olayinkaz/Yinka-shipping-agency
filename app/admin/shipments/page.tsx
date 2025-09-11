"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Package, Eye, Filter } from "lucide-react"
import { getAllShipments, updateShipmentStatus, type Shipment } from "@/lib/admin-data"

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

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [updateMessage, setUpdateMessage] = useState("")

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const data = await getAllShipments()
        setShipments(data)
        setFilteredShipments(data)
      } catch (error) {
        console.error("Error loading shipments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadShipments()
  }, [])

  useEffect(() => {
    let filtered = shipments

    if (searchTerm) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.senderName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((shipment) => shipment.status === statusFilter)
    }

    setFilteredShipments(filtered)
  }, [searchTerm, statusFilter, shipments])

  const handleStatusUpdate = async (shipmentId: string, newStatus: Shipment["status"]) => {
    try {
      const success = await updateShipmentStatus(shipmentId, newStatus)
      if (success) {
        setShipments((prev) =>
          prev.map((shipment) => (shipment.id === shipmentId ? { ...shipment, status: newStatus } : shipment)),
        )
        setUpdateMessage("Shipment status updated successfully")
        setTimeout(() => setUpdateMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error updating shipment status:", error)
    }
  }

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
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipment Management</h1>
            <p className="text-gray-600">Monitor and manage all shipments across the platform</p>
          </div>

          {updateMessage && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{updateMessage}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find specific shipments or filter by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by tracking number, sender, or recipient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="picked_up">Picked Up</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="exception">Exception</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipments List */}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{shipment.trackingNumber}</h3>
                          <Badge className={statusColors[shipment.status]}>{statusLabels[shipment.status]}</Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div>
                            <p className="font-medium text-gray-900">From:</p>
                            <p>{shipment.senderName}</p>
                            <p className="text-xs">{shipment.senderAddress}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">To:</p>
                            <p>{shipment.recipientName}</p>
                            <p className="text-xs">{shipment.recipientAddress}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Details:</p>
                            <p>Weight: {shipment.weight} lbs</p>
                            <p>Service: {shipment.serviceType}</p>
                            <p>Cost: {formatCurrency(shipment.totalCost)}</p>
                          </div>
                        </div>
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

                        <div className="flex gap-2">
                          <Select
                            value={shipment.status}
                            onValueChange={(value) => handleStatusUpdate(shipment.id, value as Shipment["status"])}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="picked_up">Picked Up</SelectItem>
                              <SelectItem value="in_transit">In Transit</SelectItem>
                              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="exception">Exception</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`/tracking?number=${shipment.trackingNumber}`}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
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
