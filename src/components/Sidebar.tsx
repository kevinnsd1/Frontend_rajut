"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  Package,
  Truck,
  RotateCcw,
  ClipboardCheck,
  FileText,
  LogOut,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const navigation = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pengiriman (Cek Resi)", href: "/pengiriman", icon: Truck },
  { name: "Retur Barang", href: "/retur-barang", icon: RotateCcw },
  { name: "Pembatalan Paket", href: "/pembatalan-paket", icon: Ban },
];


export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get user data on mount
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    // 1. Clear Auth Service (localStorage & cookies)
    authService.logout();
    
    // 2. Clear React Query Cache
    queryClient.clear();
    
    // 3. Close Modal and Redirect
    setIsLogoutOpen(false);
    router.push("/login");
    
    // 4. Force reload to ensure all states are reset
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background px-4 py-6 sticky top-0 shrink-0">
        <div className="flex items-center gap-3 px-2 pb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-bold text-lg">QL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-md font-bold tracking-tight leading-none text-primary">QueenyLook</span>
            <span className="text-[10px] text-muted-foreground mt-1 font-medium">Cozy Modern Fashion</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t pt-4 px-2">
          <button 
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition-all hover:bg-rose-50 hover:translate-x-1 mb-4"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>

          <div className="flex items-center gap-3 px-3">
            <Avatar className="h-8 w-8 text-xs">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.username || 'admin'}`} />
              <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || 'AU'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-foreground truncate w-24">{user?.username || 'Admin User'}</span>
              <span className="text-[10px] text-muted-foreground mt-1 truncate w-24">{user?.username ? `${user.username}@...` : 'admin@...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-primary/10 bg-white/90 backdrop-blur-md z-50 flex items-center justify-around px-2 pt-2 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-all",
                isActive ? "bg-primary/10 text-primary" : ""
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight",
                isActive ? "text-primary" : ""
              )}>
                {item.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}

        {/* Logout button */}
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all text-rose-400 hover:text-rose-600"
        >
          <div className="p-1.5 rounded-full">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Keluar</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[400px]">
          <div className="p-8 text-center">
             <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
             </div>
             <AlertDialogTitle className="text-xl font-bold text-slate-900 mb-2">Konfirmasi Keluar</AlertDialogTitle>
             <AlertDialogDescription className="text-sm text-slate-500 mb-8 leading-relaxed">
                Apakah Anda yakin ingin keluar? Sesi Anda akan dihentikan dan cache data akan dibersihkan sepenuhnya demi keamanan.
             </AlertDialogDescription>
             
             <div className="flex gap-3">
                <AlertDialogCancel className="flex-1 rounded-2xl h-12 font-bold border-slate-100 text-slate-400 hover:bg-slate-50 m-0">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl h-12 font-bold shadow-lg shadow-rose-200 m-0"
                >
                  Ya, Keluar
                </AlertDialogAction>
             </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
