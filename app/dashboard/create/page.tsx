"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, ArrowRight, ArrowLeft } from "lucide-react"
import { createShipment } from "@/lib/mock-data"
import { CheckoutForm } from "@/components/payment/checkout-form"
import { useAuth } from "@/contexts/auth-context"

type Step = "details" | "payment" | "confirmation"

export default function CreateShipmentPage() {
  const [currentStep, setCurrentStep] = useState<Step>("details")
  const [formData, setFormData] = useState({
    // Sender information
    senderName: "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderPostalCode: "",
    senderPhone: "",

    // Recipient information
    recipientName: "",
    recipientAddress: "",
    recipientCity: "",
    recipientState: "",
    recipientPostalCode: "",
    recipientPhone: "",

    // Package details
    weight: "",
    length: "",
    width: "",
    height: "",
    declaredValue: "",
    serviceType: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shipmentId, setShipmentId] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateShippingCost = () => {
    const weight = Number.parseFloat(formData.weight) || 0
    const baseRate = formData.serviceType === "overnight" ? 15 : formData.serviceType === "express" ? 8 : 5
    return Math.max(baseRate + weight * 2, 10)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const shippingCost = calculateShippingCost()

      const shipmentData = {
        customerId: user?.id || "",
        senderName: formData.senderName,
        senderAddress: `${formData.senderAddress}, ${formData.senderCity}, ${formData.senderState} ${formData.senderPostalCode}`,
        recipientName: formData.recipientName,
        recipientAddress: `${formData.recipientAddress}, ${formData.recipientCity}, ${formData.recipientState} ${formData.recipientPostalCode}`,
        weight: Number.parseFloat(formData.weight),
        serviceType: formData.serviceType as "standard" | "express" | "overnight",
        status: "pending" as const,
        estimatedDelivery: new Date(
          Date.now() +
            (formData.serviceType === "overnight" ? 1 : formData.serviceType === "express" ? 2 : 5) *
              24 *
              60 *
              60 *
              1000,
        )
          .toISOString()
          .split("T")[0],
        shippingCost,
        totalCost: shippingCost,
      }

      const newShipment = await createShipment(shipmentData)
      setShipmentId(newShipment.id)
      setCurrentStep("payment")
    } catch (error) {
      setError("Failed to create shipment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentId(paymentId)
    setCurrentStep("confirmation")
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: "details", label: "Shipment Details" },
      { key: "payment", label: "Payment" },
      { key: "confirmation", label: "Confirmation" },
    ]

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step.key
                  ? "bg-blue-600 text-white"
                  : steps.findIndex((s) => s.key === currentStep) > index
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${currentStep === step.key ? "text-blue-600" : "text-gray-600"}`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />

        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Shipment</h1>
            <p className="text-gray-600">Follow the steps below to create and pay for your shipment</p>
          </div>

          {renderStepIndicator()}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === "details" && (
            <form onSubmit={handleDetailsSubmit} className="space-y-8">
              {/* Sender Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Sender Information</CardTitle>
                  <CardDescription>Details of the person or business sending the package</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Full Name *</Label>
                      <Input
                        id="senderName"
                        value={formData.senderName}
                        onChange={(e) => handleChange("senderName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderPhone">Phone Number</Label>
                      <Input
                        id="senderPhone"
                        type="tel"
                        value={formData.senderPhone}
                        onChange={(e) => handleChange("senderPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderAddress">Street Address *</Label>
                    <Input
                      id="senderAddress"
                      value={formData.senderAddress}
                      onChange={(e) => handleChange("senderAddress", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderCity">City *</Label>
                      <Input
                        id="senderCity"
                        value={formData.senderCity}
                        onChange={(e) => handleChange("senderCity", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderState">State *</Label>
                      <Input
                        id="senderState"
                        value={formData.senderState}
                        onChange={(e) => handleChange("senderState", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderPostalCode">ZIP Code *</Label>
                      <Input
                        id="senderPostalCode"
                        value={formData.senderPostalCode}
                        onChange={(e) => handleChange("senderPostalCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Recipient Information</CardTitle>
                  <CardDescription>Details of the person or business receiving the package</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Full Name *</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => handleChange("recipientName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientPhone">Phone Number</Label>
                      <Input
                        id="recipientPhone"
                        type="tel"
                        value={formData.recipientPhone}
                        onChange={(e) => handleChange("recipientPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientAddress">Street Address *</Label>
                    <Input
                      id="recipientAddress"
                      value={formData.recipientAddress}
                      onChange={(e) => handleChange("recipientAddress", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientCity">City *</Label>
                      <Input
                        id="recipientCity"
                        value={formData.recipientCity}
                        onChange={(e) => handleChange("recipientCity", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientState">State *</Label>
                      <Input
                        id="recipientState"
                        value={formData.recipientState}
                        onChange={(e) => handleChange("recipientState", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientPostalCode">ZIP Code *</Label>
                      <Input
                        id="recipientPostalCode"
                        value={formData.recipientPostalCode}
                        onChange={(e) => handleChange("recipientPostalCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Package Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                  <CardDescription>Information about the package being shipped</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={formData.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value: string) => handleChange("serviceType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (5-7 business days)</SelectItem>
                          <SelectItem value="express">Express (2-3 business days)</SelectItem>
                          <SelectItem value="overnight">Overnight (Next business day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (inches)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.length}
                        onChange={(e) => handleChange("length", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (inches)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.width}
                        onChange={(e) => handleChange("width", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (inches)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.height}
                        onChange={(e) => handleChange("height", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="declaredValue">Declared Value (USD)</Label>
                    <Input
                      id="declaredValue"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.declaredValue}
                      onChange={(e) => handleChange("declaredValue", e.target.value)}
                      placeholder="Optional - for insurance purposes"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Cost Preview */}
              {formData.weight && formData.serviceType && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Cost</CardTitle>
                    <CardDescription>Estimated cost based on package details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">${calculateShippingCost().toFixed(2)}</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Final cost may vary based on actual package dimensions and weight
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Shipment...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {currentStep === "payment" && (
            <div className="space-y-6">
              <CheckoutForm
                amount={calculateShippingCost()}
                shipmentId={shipmentId}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
              <Button variant="outline" onClick={() => setCurrentStep("details")} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Details
              </Button>
            </div>
          )}

          {currentStep === "confirmation" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                <CardDescription>Your shipment has been created and payment processed</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Payment ID</p>
                  <p className="font-mono text-sm">{paymentId}</p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => router.push("/dashboard/shipments")} className="flex-1">
                    View All Shipments
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
