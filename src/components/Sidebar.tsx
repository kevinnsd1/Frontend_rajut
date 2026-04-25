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

const navigation = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Input Barang", href: "/input-barang", icon: PlusSquare },
  { name: "Data Barang", href: "/data-barang", icon: Package },
  { name: "Pengiriman", href: "/pengiriman", icon: Truck },
  { name: "Retur Barang", href: "/retur-barang", icon: RotateCcw },
  { name: "Stock Opname", href: "/stock-opname", icon: ClipboardCheck },
  { name: "Laporan", href: "/laporan", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background px-4 py-6">
      <div className="flex items-center gap-3 px-2 pb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
          <span className="font-bold text-xs">VM</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight leading-none">VogueManage</span>
          <span className="text-[10px] text-muted-foreground mt-1">Fashion Operations</span>
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
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t pt-4 px-2">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground mb-4">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>

        <div className="flex items-center gap-3 px-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Admin User</span>
            <span className="text-[10px] text-muted-foreground mt-1">admin@voguemanage.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
