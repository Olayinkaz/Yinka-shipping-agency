"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Plus, Lock } from "lucide-react"
import { getPaymentMethods, processPayment, type PaymentMethod } from "@/lib/payment"
import { PaymentForm } from "./payment-form"
import { useAuth } from "@/contexts/auth-context"

interface CheckoutFormProps {
  amount: number
  shipmentId: string
  onPaymentSuccess: (paymentId: string) => void
  onPaymentError: (error: string) => void
}

export function CheckoutForm({ amount, shipmentId, onPaymentSuccess, onPaymentError }: CheckoutFormProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [showAddCard, setShowAddCard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMethods, setIsLoadingMethods] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (user) {
        try {
          const methods = await getPaymentMethods(user.id)
          setPaymentMethods(methods)
          if (methods.length > 0) {
            const defaultMethod = methods.find((m) => m.isDefault) || methods[0]
            setSelectedPaymentMethod(defaultMethod.id)
          }
        } catch (error) {
          console.error("Error loading payment methods:", error)
        } finally {
          setIsLoadingMethods(false)
        }
      }
    }

    loadPaymentMethods()
  }, [user])

  const handlePaymentMethodAdded = (newPaymentMethod: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, newPaymentMethod])
    setSelectedPaymentMethod(newPaymentMethod.id)
    setShowAddCard(false)
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      onPaymentError("Please select a payment method")
      return
    }

    setIsLoading(true)

    try {
      const result = await processPayment(amount, selectedPaymentMethod, shipmentId)

      if (result.success && result.paymentId) {
        onPaymentSuccess(result.paymentId)
      } else {
        onPaymentError(result.error || "Payment failed")
      }
    } catch (error) {
      onPaymentError("An error occurred during payment processing")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getBrandIcon = (brand?: string) => {
    switch (brand) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      default:
        return "💳"
    }
  }

  if (showAddCard) {
    return <PaymentForm onPaymentMethodAdded={handlePaymentMethodAdded} onCancel={() => setShowAddCard(false)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Choose your payment method and complete your order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        {isLoadingMethods ? (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading payment methods...</p>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-6">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No payment methods</h3>
            <p className="text-gray-600 mb-4">Add a payment method to continue</p>
            <Button onClick={() => setShowAddCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Payment Method</Label>
              <Button variant="outline" size="sm" onClick={() => setShowAddCard(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>

            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getBrandIcon(method.brand)}</span>
                        <div>
                          <p className="font-medium">
                            {method.brand?.toUpperCase()} ending in {method.last4}
                          </p>
                          {method.expiryMonth && method.expiryYear && (
                            <p className="text-sm text-gray-600">
                              Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                            </p>
                          )}
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
          <Lock className="h-4 w-4 text-green-600" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>

        {/* Payment Button */}
        {paymentMethods.length > 0 && (
          <Button onClick={handlePayment} disabled={isLoading || !selectedPaymentMethod} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {formatCurrency(amount)}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
