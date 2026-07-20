import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./Sidebar"
import { SiteHeader } from "./Header"

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
