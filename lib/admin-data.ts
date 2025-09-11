import { mockShipments, mockTrackingEvents, type Shipment, type TrackingEvent } from "./mock-data"
import { mockPayments, type Payment } from "./payment"
import type { User } from "./auth"

// Extended admin data and functions
export interface AdminStats {
  totalShipments: number
  totalRevenue: number
  totalCustomers: number
  pendingShipments: number
  inTransitShipments: number
  deliveredShipments: number
  monthlyGrowth: number
  revenueGrowth: number
}

export interface CustomerData extends User {
  totalShipments: number
  totalSpent: number
  lastShipment?: string
  joinedDate: string
}

// Mock customer data
export const mockCustomers: CustomerData[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "customer@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "customer",
    createdAt: "2024-11-15T10:00:00Z",
    totalShipments: 3,
    totalSpent: 83.49,
    lastShipment: "2024-12-11T16:45:00Z",
    joinedDate: "2024-11-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    email: "jane.smith@company.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "customer",
    createdAt: "2024-10-20T14:30:00Z",
    totalShipments: 12,
    totalSpent: 456.78,
    lastShipment: "2024-12-08T09:15:00Z",
    joinedDate: "2024-10-20T14:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    email: "bob.wilson@startup.io",
    firstName: "Bob",
    lastName: "Wilson",
    role: "customer",
    createdAt: "2024-12-01T08:45:00Z",
    totalShipments: 1,
    totalSpent: 25.99,
    lastShipment: "2024-12-05T11:20:00Z",
    joinedDate: "2024-12-01T08:45:00Z",
  },
]

// Mock admin functions
export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const totalShipments = mockShipments.length
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalCustomers = mockCustomers.length
  const pendingShipments = mockShipments.filter((s) => s.status === "pending").length
  const inTransitShipments = mockShipments.filter((s) => s.status === "in_transit").length
  const deliveredShipments = mockShipments.filter((s) => s.status === "delivered").length

  return {
    totalShipments,
    totalRevenue,
    totalCustomers,
    pendingShipments,
    inTransitShipments,
    deliveredShipments,
    monthlyGrowth: 12.5,
    revenueGrowth: 18.3,
  }
}

export async function getAllShipments(): Promise<Shipment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockShipments
}

export async function getAllCustomers(): Promise<CustomerData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockCustomers
}

export async function getAllPayments(): Promise<Payment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPayments
}

export async function updateShipmentStatus(
  shipmentId: string,
  status: Shipment["status"],
  location?: string,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const shipment = mockShipments.find((s) => s.id === shipmentId)
  if (shipment) {
    shipment.status = status
    shipment.updatedAt = new Date().toISOString()

    // Add tracking event
    const newEvent: TrackingEvent = {
      id: crypto.randomUUID(),
      shipmentId,
      status,
      description: `Status updated to ${status.replace("_", " ")}`,
      location: location || "Processing Center",
      eventTime: new Date().toISOString(),
    }
    mockTrackingEvents.push(newEvent)

    return true
  }
  return false
}

export async function searchShipments(query: string): Promise<Shipment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query.trim()) return mockShipments

  return mockShipments.filter(
    (shipment) =>
      shipment.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      shipment.recipientName.toLowerCase().includes(query.toLowerCase()) ||
      shipment.senderName.toLowerCase().includes(query.toLowerCase()),
  )
}

export async function searchCustomers(query: string): Promise<CustomerData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query.trim()) return mockCustomers

  return mockCustomers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(query.toLowerCase()),
  )
}
