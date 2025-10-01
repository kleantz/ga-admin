import Sidebar from "./sidebar"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
