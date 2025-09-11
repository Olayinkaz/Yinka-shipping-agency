import { RegisterForm } from "@/components/auth/register-form"
import { Package } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">ShipFast Agency</span>
        </Link>
        <RegisterForm />
      </div>
    </div>
  )
}
