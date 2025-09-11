import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Database, Mail, Shield, Bell, Globe } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
            <p className="text-gray-600">Configure system settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>General system settings and configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Shipping Rates</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure base shipping rates and calculations</p>
                    <Button variant="outline" size="sm">
                      Configure Rates
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Service Areas</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage supported shipping regions and zones</p>
                    <Button variant="outline" size="sm">
                      Manage Areas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database & Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database & Integrations
                </CardTitle>
                <CardDescription>Manage database connections and third-party integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Database Status</h3>
                    <p className="text-sm text-gray-600 mb-3">Monitor database health and performance</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Payment Gateway</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure Stripe and payment processing</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Test Mode</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure email notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Email Templates</h3>
                    <p className="text-sm text-gray-600 mb-3">Customize customer email notifications</p>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Edit Templates
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Admin Alerts</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure system alerts and notifications</p>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Configure Alerts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access
                </CardTitle>
                <CardDescription>Manage security settings and user access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">User Roles</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure user roles and permissions</p>
                    <Button variant="outline" size="sm">
                      Manage Roles
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">API Keys</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage API access keys and tokens</p>
                    <Button variant="outline" size="sm">
                      View Keys
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Localization
                </CardTitle>
                <CardDescription>Configure regional settings and localization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Currency Settings</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure supported currencies and rates</p>
                    <Button variant="outline" size="sm">
                      Configure Currency
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Time Zones</h3>
                    <p className="text-sm text-gray-600 mb-3">Set default time zone and regional formats</p>
                    <Button variant="outline" size="sm">
                      Set Time Zone
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
