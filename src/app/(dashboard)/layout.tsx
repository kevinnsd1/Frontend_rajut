import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-[#fafafa] text-foreground font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 shrink-0">
          <div className="w-96">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search inventory, orders..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-slate-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
