// Payment utilities and types
export interface PaymentMethod {
  id: string
  type: "card" | "bank_account"
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface Payment {
  id: string
  shipmentId: string
  customerId: string
  amount: number
  currency: string
  paymentMethod: string
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded"
  stripePaymentIntentId?: string
  transactionId: string
  createdAt: string
  updatedAt: string
}

// Mock payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1234567890",
    type: "card",
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm_0987654321",
    type: "card",
    last4: "0005",
    brand: "mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
]

// Mock payments
export const mockPayments: Payment[] = [
  {
    id: "pay_1234567890",
    shipmentId: "550e8400-e29b-41d4-a716-446655440003",
    customerId: "550e8400-e29b-41d4-a716-446655440002",
    amount: 25.99,
    currency: "USD",
    paymentMethod: "Visa ending in 4242",
    paymentStatus: "completed",
    transactionId: "txn_1234567890",
    createdAt: "2024-12-10T10:00:00Z",
    updatedAt: "2024-12-10T10:01:00Z",
  },
  {
    id: "pay_0987654321",
    shipmentId: "550e8400-e29b-41d4-a716-446655440004",
    customerId: "550e8400-e29b-41d4-a716-446655440002",
    amount: 12.5,
    currency: "USD",
    paymentMethod: "Visa ending in 4242",
    paymentStatus: "completed",
    transactionId: "txn_0987654321",
    createdAt: "2024-12-05T09:15:00Z",
    updatedAt: "2024-12-05T09:16:00Z",
  },
]

// Mock payment processing functions
export async function processPayment(
  amount: number,
  paymentMethodId: string,
  shipmentId: string,
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock payment processing - 95% success rate
  const success = Math.random() > 0.05

  if (success) {
    const payment: Payment = {
      id: `pay_${Math.random().toString().slice(2, 12)}`,
      shipmentId,
      customerId: "550e8400-e29b-41d4-a716-446655440002",
      amount,
      currency: "USD",
      paymentMethod: "Visa ending in 4242",
      paymentStatus: "completed",
      transactionId: `txn_${Math.random().toString().slice(2, 12)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockPayments.unshift(payment)
    return { success: true, paymentId: payment.id }
  } else {
    return { success: false, error: "Payment failed. Please try again or use a different payment method." }
  }
}

export async function getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPaymentMethods
}

export async function getPayments(userId: string): Promise<Payment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPayments
}

export async function addPaymentMethod(cardData: {
  number: string
  expiryMonth: number
  expiryYear: number
  cvc: string
  name: string
}): Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock validation - reject invalid card numbers
  if (cardData.number.length < 16) {
    return { success: false, error: "Invalid card number" }
  }

  const newPaymentMethod: PaymentMethod = {
    id: `pm_${Math.random().toString().slice(2, 12)}`,
    type: "card",
    last4: cardData.number.slice(-4),
    brand: cardData.number.startsWith("4") ? "visa" : "mastercard",
    expiryMonth: cardData.expiryMonth,
    expiryYear: cardData.expiryYear,
    isDefault: mockPaymentMethods.length === 0,
  }

  mockPaymentMethods.push(newPaymentMethod)
  return { success: true, paymentMethod: newPaymentMethod }
}
