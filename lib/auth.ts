// Authentication utilities and types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "customer" | "admin" | "staff"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions (replace with real API calls when database is connected)
export async function signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock authentication - replace with real API call
  if (email === "admin@shippingagency.com" && password === "admin123") {
    return {
      user: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "admin@shippingagency.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      token: "mock-jwt-token-admin",
    }
  }

  if (email === "customer@example.com" && password === "customer123") {
    return {
      user: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        email: "customer@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
        createdAt: new Date().toISOString(),
      },
      token: "mock-jwt-token-customer",
    }
  }

  return null
}

export async function signUp(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  companyName?: string
}): Promise<{ user: User; token: string } | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user creation - replace with real API call
  const newUser: User = {
    id: crypto.randomUUID(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: "customer",
    createdAt: new Date().toISOString(),
  }

  return {
    user: newUser,
    token: "mock-jwt-token-new-user",
  }
}

export async function signOut(): Promise<void> {
  // Clear local storage and cookies
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("auth-user")
  }
}

export function getStoredAuth(): { user: User; token: string } | null {
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem("auth-token")
    const userStr = localStorage.getItem("auth-user")

    if (token && userStr) {
      const user = JSON.parse(userStr)
      return { user, token }
    }
  } catch (error) {
    console.error("Error parsing stored auth:", error)
  }

  return null
}

export function storeAuth(user: User, token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-token", token)
    localStorage.setItem("auth-user", JSON.stringify(user))
  }
}
