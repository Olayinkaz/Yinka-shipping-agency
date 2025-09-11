"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type AuthState, signOut as authSignOut, getStoredAuth } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    companyName?: string
  }) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for stored authentication on mount
    const storedAuth = getStoredAuth()
    if (storedAuth) {
      setAuthState({
        user: storedAuth.user,
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { signIn: authSignIn, storeAuth } = await import("@/lib/auth")
      const result = await authSignIn(email, password)

      if (result) {
        storeAuth(result.user, result.token)
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    companyName?: string
  }): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { signUp: authSignUp, storeAuth } = await import("@/lib/auth")
      const result = await authSignUp(userData)

      if (result) {
        storeAuth(result.user, result.token)
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      console.error("Sign up error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const signOut = async (): Promise<void> => {
    await authSignOut()
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
