"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Truck, RotateCcw, Package, Loader2 } from "lucide-react";
import { apiService } from "@/services/api";

interface Shipment {
  item_code?: string;
  resi_number?: string;
  courier?: string;
  last_status?: string;
  is_delivered?: boolean | number;
}

interface ReturnItem {
  id?: number;
  sku_code?: string;
  status?: string;
  reason?: string;
  created_at?: string;
}

export default function DashboardHome() {
  const { data: shipments = [], isLoading: loadingShipments } = useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: () => apiService.getShipmentList(),
    refetchInterval: 1000 * 60 * 10,
  });

  const { data: returns = [], isLoading: loadingReturns } = useQuery<ReturnItem[]>({
    queryKey: ["returns"],
    queryFn: () => apiService.getReturns(),
    refetchInterval: 1000 * 60 * 10,
  });

  const isLoading = loadingShipments || loadingReturns;

  // Hitung statistik dari data yang ada
  const totalShipments  = shipments.length;
  const delivered       = shipments.filter(s => s.is_delivered).length;
  const pendingReturns  = returns.filter(r => r.status?.toUpperCase() === "PENDING").length;
  const totalReturns    = returns.length;

  // Aktivitas terkini: gabungkan pengiriman & retur, urutkan by newest
  const activities = [
    ...shipments.slice(0, 5).map(s => ({
      title: `Resi ${s.resi_number || s.item_code}`,
      desc:  `Kurir: ${s.courier?.toUpperCase() || "—"} · Kode: ${s.item_code || "—"}`,
      type:  s.is_delivered ? "Terkirim" : "Pengiriman",
      color: s.is_delivered ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100",
    })),
    ...returns.slice(0, 3).map(r => ({
      title: `Retur: ${r.sku_code || "—"}`,
      desc:  r.reason || "—",
      type:  "Retur",
      color: "bg-orange-50 text-orange-600 border-orange-100",
    })),
  ].slice(0, 7);

  const stats = [
    {
      label: "Total Pengiriman",
      value: totalShipments,
      sub: `${delivered} sudah terkirim`,
      icon: Truck,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Retur Tertunda",
      value: pendingReturns,
      sub: `${totalReturns} total retur`,
      icon: RotateCcw,
      color: "bg-orange-50 text-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Selamat datang kembali. Berikut adalah ringkasan operasional QueenyLook.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-8 border-primary/5 shadow-xl shadow-primary/5 rounded-[2rem] bg-white hover:shadow-primary/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{stat.label}</span>
              <div className={`h-14 w-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-7 w-7" />
              </div>
            </div>
            <div className="text-5xl font-black text-foreground tracking-tighter">{stat.value}</div>
            <div className="flex items-center text-sm mt-4 text-muted-foreground">
              <span className="font-medium text-primary/60">{stat.sub}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Aktivitas Terkini */}
      <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
        <div className="px-8 py-6 border-b border-primary/5 flex justify-between items-center bg-primary/[0.02]">
          <h2 className="font-bold text-lg text-foreground">Aktivitas Terkini</h2>
        </div>
        <div className="divide-y divide-primary/5">
          {activities.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm font-medium italic">
              Belum ada aktivitas tercatat.
            </div>
          ) : (
            activities.map((activity, i) => (
              <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-primary/[0.02] transition-colors group">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{activity.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs truncate">{activity.desc}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-3 py-1.5 rounded-full border font-bold uppercase tracking-wider ${activity.color}`}>
                  {activity.type}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
