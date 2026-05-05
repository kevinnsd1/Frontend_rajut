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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pengiriman (Cek Resi)", href: "/pengiriman", icon: Truck },
  { name: "Retur Barang", href: "/retur-barang", icon: RotateCcw },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

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
    authService.logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background px-4 py-6">
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
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground mb-4"
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
            <span className="text-sm font-bold leading-none text-foreground">{user?.username || 'Admin User'}</span>
            <span className="text-[10px] text-muted-foreground mt-1">{user?.username ? `${user.username}@queenylook.com` : 'admin@queenylook.com'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
