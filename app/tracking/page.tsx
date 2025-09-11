"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Search, MapPin, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react"
import { getShipment, getTrackingEvents, type Shipment, type TrackingEvent } from "@/lib/mock-data"
import Link from "next/link"

const statusIcons = {
  pending: Clock,
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  exception: AlertCircle,
  cancelled: AlertCircle,
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  picked_up: "bg-blue-100 text-blue-800",
  in_transit: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  exception: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get("number") || "")
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!trackingNumber.trim()) return

    setIsLoading(true)
    setError("")
    setShipment(null)
    setTrackingEvents([])

    try {
      const shipmentData = await getShipment(trackingNumber.trim())
      if (shipmentData) {
        setShipment(shipmentData)
        const events = await getTrackingEvents(shipmentData.id)
        setTrackingEvents(events.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()))
      } else {
        setError("Tracking number not found. Please check the number and try again.")
      }
    } catch (error) {
      setError("An error occurred while tracking your package. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get("number")) {
      handleSearch()
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ShipFast Agency</span>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Package</h1>
          <p className="text-gray-600">Enter your tracking number to see the latest updates</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter tracking number (e.g., SA123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Package className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {shipment && (
          <div className="space-y-6">
            {/* Shipment Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{shipment.trackingNumber}</CardTitle>
                    <CardDescription>Shipment Details</CardDescription>
                  </div>
                  <Badge className={`${statusColors[shipment.status]} text-lg px-4 py-2`}>
                    {shipment.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-medium">
                          {shipment.serviceType.charAt(0).toUpperCase() + shipment.serviceType.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{shipment.weight} lbs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Cost:</span>
                        <span className="font-medium">{formatCurrency(shipment.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Delivery:</span>
                        <span className="font-medium">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Addresses</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">From:</p>
                        <p>{shipment.senderName}</p>
                        <p className="text-gray-600">{shipment.senderAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">To:</p>
                        <p>{shipment.recipientName}</p>
                        <p className="text-gray-600">{shipment.recipientAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
                <CardDescription>Latest updates for your shipment</CardDescription>
              </CardHeader>
              <CardContent>
                {trackingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tracking events available yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trackingEvents.map((event, index) => {
                      const StatusIcon = statusIcons[event.status as keyof typeof statusIcons] || Package
                      const isLatest = index === 0

                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-full ${isLatest ? "bg-blue-100" : "bg-gray-100"}`}>
                              <StatusIcon className={`h-4 w-4 ${isLatest ? "text-blue-600" : "text-gray-600"}`} />
                            </div>
                            {index < trackingEvents.length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium ${isLatest ? "text-blue-600" : "text-gray-900"}`}>
                                {event.description}
                              </h4>
                              <span className="text-sm text-gray-500">{formatDate(event.eventTime)}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo Tracking Numbers */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Demo Tracking Numbers</CardTitle>
            <CardDescription>Try these sample tracking numbers to see the system in action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">SA123456789</p>
                <p className="text-gray-600">In Transit</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">SA987654321</p>
                <p className="text-gray-600">Delivered</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">SA456789123</p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
