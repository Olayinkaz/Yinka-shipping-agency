export interface Shipment {
  id: string
  trackingNumber: string
  customerId: string
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  weight: number
  serviceType: "standard" | "express" | "overnight"
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception" | "cancelled"
  estimatedDelivery: string
  actualDelivery?: string
  shippingCost: number
  totalCost: number
  createdAt: string
  updatedAt?: string
}

export interface TrackingEvent {
  id: string
  shipmentId: string
  status: string
  description: string
  location: string
  eventTime: string
}

// Mock shipments data
export const mockShipments: Shipment[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    trackingNumber: "SA123456789",
    customerId: "550e8400-e29b-41d4-a716-446655440002",
    senderName: "John Doe",
    senderAddress: "123 Business St, New York, NY 10001",
    recipientName: "Jane Smith",
    recipientAddress: "456 Residential Ave, Los Angeles, CA 90210",
    weight: 5.5,
    serviceType: "express",
    status: "in_transit",
    estimatedDelivery: "2024-12-15",
    shippingCost: 25.99,
    totalCost: 25.99,
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    trackingNumber: "SA987654321",
    customerId: "550e8400-e29b-41d4-a716-446655440002",
    senderName: "John Doe",
    senderAddress: "123 Business St, New York, NY 10001",
    recipientName: "Bob Johnson",
    recipientAddress: "789 Corporate Blvd, Chicago, IL 60601",
    weight: 2.3,
    serviceType: "standard",
    status: "delivered",
    estimatedDelivery: "2024-12-08",
    actualDelivery: "2024-12-08T14:30:00Z",
    shippingCost: 12.5,
    totalCost: 12.5,
    createdAt: "2024-12-05T09:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    trackingNumber: "SA456789123",
    customerId: "550e8400-e29b-41d4-a716-446655440002",
    senderName: "John Doe",
    senderAddress: "123 Business St, New York, NY 10001",
    recipientName: "Alice Brown",
    recipientAddress: "321 Main St, Miami, FL 33101",
    weight: 8.7,
    serviceType: "overnight",
    status: "pending",
    estimatedDelivery: "2024-12-12",
    shippingCost: 45.0,
    totalCost: 45.0,
    createdAt: "2024-12-11T16:45:00Z",
  },
]

// Mock tracking events
export const mockTrackingEvents: TrackingEvent[] = [
  {
    id: "1",
    shipmentId: "550e8400-e29b-41d4-a716-446655440003",
    status: "picked_up",
    description: "Package picked up from sender",
    location: "New York, NY",
    eventTime: "2024-12-10T11:00:00Z",
  },
  {
    id: "2",
    shipmentId: "550e8400-e29b-41d4-a716-446655440003",
    status: "in_transit",
    description: "Package in transit to destination",
    location: "Chicago, IL",
    eventTime: "2024-12-11T08:30:00Z",
  },
  {
    id: "3",
    shipmentId: "550e8400-e29b-41d4-a716-446655440004",
    status: "picked_up",
    description: "Package picked up from sender",
    location: "New York, NY",
    eventTime: "2024-12-05T10:00:00Z",
  },
  {
    id: "4",
    shipmentId: "550e8400-e29b-41d4-a716-446655440004",
    status: "delivered",
    description: "Package delivered successfully",
    location: "Chicago, IL",
    eventTime: "2024-12-08T14:30:00Z",
  },
]

// Mock API functions
export async function getShipments(userId: string): Promise<Shipment[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockShipments
}

export async function getShipment(trackingNumber: string): Promise<Shipment | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockShipments.find((s) => s.trackingNumber === trackingNumber) || null
}

export async function getTrackingEvents(shipmentId: string): Promise<TrackingEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockTrackingEvents.filter((e) => e.shipmentId === shipmentId)
}

export async function createShipment(
  shipmentData: Omit<Shipment, "id" | "trackingNumber" | "createdAt">,
): Promise<Shipment> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newShipment: Shipment = {
    ...shipmentData,
    id: crypto.randomUUID(),
    trackingNumber: `SA${Math.random().toString().slice(2, 11)}`,
    createdAt: new Date().toISOString(),
  }

  mockShipments.unshift(newShipment)
  return newShipment
}
