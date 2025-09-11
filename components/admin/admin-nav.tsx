"use client"

import { Button } from "@/components/ui/button"
import { Package, Users, BarChart3, CreditCard, Settings, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AdminNav() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ShipFast Agency</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">ADMIN</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/shipments"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Shipments
            </Link>
            <Link
              href="/admin/customers"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/admin/payments"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
            <Link
              href="/admin/settings"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
