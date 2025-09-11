"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Calendar, DollarSign } from "lucide-react"
import { getPayments, getPaymentMethods, type Payment, type PaymentMethod } from "@/lib/payment"
import { PaymentForm } from "@/components/payment/payment-form"
import { useAuth } from "@/contexts/auth-context"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const [paymentsData, methodsData] = await Promise.all([getPayments(user.id), getPaymentMethods(user.id)])
          setPayments(paymentsData)
          setPaymentMethods(methodsData)
        } catch (error) {
          console.error("Error loading payment data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadData()
  }, [user])

  const handlePaymentMethodAdded = (newPaymentMethod: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, newPaymentMethod])
    setShowAddCard(false)
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

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
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
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <DashboardNav />
          <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <PaymentForm onPaymentMethodAdded={handlePaymentMethodAdded} onCancel={() => setShowAddCard(false)} />
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Billing</h1>
              <p className="text-gray-600">Manage your payment methods and view transaction history</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your saved payment methods</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setShowAddCard(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-6">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No payment methods added</p>
                      <Button onClick={() => setShowAddCard(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{getBrandIcon(method.brand)}</span>
                              <div>
                                <p className="font-medium">
                                  {method.brand?.toUpperCase()} •••• {method.last4}
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
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                  <CardDescription>December 2024 summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-medium">$234.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Transactions</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average</span>
                      <span className="font-medium">$29.31</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Your recent payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Loading payments...</p>
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                      <p className="text-gray-600">Your payment history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{formatCurrency(payment.amount)}</p>
                              <p className="text-sm text-gray-600">
                                {payment.paymentMethod} • {payment.transactionId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={statusColors[payment.paymentStatus]}>
                              {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
