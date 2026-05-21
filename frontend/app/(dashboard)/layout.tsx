import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="pl-64">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
