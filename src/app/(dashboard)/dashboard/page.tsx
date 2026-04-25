import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Package, Truck, RotateCcw, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back. Here is your fashion operations summary.
          </p>
        </div>
        <Button className="bg-black text-white hover:bg-black/80 rounded-md">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-slate-100 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Total Inventory</span>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">24,592</div>
          <div className="flex items-center text-xs mt-2 text-slate-500">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span>+12% from last month</span>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Pending Shipments</span>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Truck className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">143</div>
          <div className="flex items-center text-xs mt-2 text-slate-500">
            <span>Requires processing today</span>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Recent Returns</span>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <RotateCcw className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">28</div>
          <div className="flex items-center text-xs mt-2 text-slate-500">
            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
            <span>-4% from last week</span>
          </div>
        </Card>

        <Card className="p-6 border-red-200 bg-red-50/30 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase">Stock Alerts</span>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <div className="flex items-center text-xs mt-2 text-red-600">
            <span>Items below minimum threshold</span>
          </div>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <h2 className="font-bold">Recent Activity</h2>
          <Button variant="ghost" className="text-xs h-8 text-slate-500">
            View All &rarr;
          </Button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            {
              title: "New Inventory Added",
              desc: "Silk Blouse Collection (AW24) - 250 units",
              time: "10 mins ago",
              badge: "Input",
              icon: Package,
              badgeColor: "bg-slate-100 text-slate-600",
              iconBg: "bg-orange-100 text-orange-600",
            },
            {
              title: "Shipment Dispatched",
              desc: "Order #VG-8824 to Boutique Paris",
              time: "1 hr ago",
              badge: "Outbound",
              icon: Truck,
              badgeColor: "bg-slate-100 text-slate-600",
              iconBg: "bg-slate-100 text-slate-600",
            },
            {
              title: "Return Processed",
              desc: "Classic Leather Tote - Quality Check Passed",
              time: "3 hrs ago",
              badge: "Return",
              icon: RotateCcw,
              badgeColor: "bg-slate-100 text-slate-600",
              iconBg: "bg-stone-100 text-stone-600",
            },
            {
              title: "Low Stock Alert",
              desc: "Cashmere Scarves (Beige) - Only 3 left",
              time: "5 hrs ago",
              badge: "Alert",
              icon: AlertTriangle,
              badgeColor: "bg-red-100 text-red-600 border-red-200",
              iconBg: "bg-red-100 text-red-600",
            },
          ].map((activity, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${activity.iconBg}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activity.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-slate-400">{activity.time}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${activity.badgeColor}`}>
                  {activity.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
