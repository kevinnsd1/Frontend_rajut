import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ClipboardCheck, AlertTriangle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function StockOpnamePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Opname</h1>
          <p className="text-sm text-slate-500 mt-1">
            Reconcile system stock with physical inventory.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="flex items-center gap-4 px-4 py-2 border-slate-200 shadow-sm bg-white">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Items Checked</p>
              <p className="font-bold text-slate-900">245 / 350</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 px-4 py-2 border-red-200 shadow-sm bg-red-50/50">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-red-400 uppercase">Discrepancies</p>
              <p className="font-bold text-red-600">12</p>
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b flex justify-between items-center bg-white gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" 
              placeholder="Filter Kode Barang..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-200"
            />
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="text-slate-600">Save Progress</Button>
             <Button className="bg-black text-white hover:bg-black/80">Complete Opname</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Kode Barang & Detail</TableHead>
              <TableHead className="w-[150px] text-center text-xs font-bold uppercase tracking-widest text-slate-400">Stok Sistem</TableHead>
              <TableHead className="w-[200px] text-center text-xs font-bold uppercase tracking-widest text-slate-400">Stok Fisik</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "VG-SLK-001",
                name: "Ivory Silk Blouse (M)",
                system: 45,
                physical: "45",
                status: "match",
                imgBg: "bg-orange-100",
              },
              {
                id: "VG-OSH-012",
                name: "Oversized Denim Jacket (L)",
                system: 20,
                physical: "28",
                status: "mismatch",
                imgBg: "bg-blue-100",
              },
              {
                id: "VG-ACC-045",
                name: "Classic Leather Tote",
                system: 15,
                physical: "15",
                status: "match",
                imgBg: "bg-orange-50",
              },
              {
                id: "VG-TRS-088",
                name: "Navy Pleated Trouser (S)",
                system: 12,
                physical: "",
                status: "pending",
                imgBg: "bg-stone-100",
              },
            ].map((item, i) => (
              <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-md ${item.imgBg} flex items-center justify-center`}>
                      <span className="text-[8px] text-slate-400">IMG</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-slate-500">{item.id}</div>
                      <div className="font-bold text-sm text-slate-900">{item.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium text-slate-700 py-4">
                  {item.system}
                </TableCell>
                <TableCell className="text-center py-4">
                  <input
                    type="text"
                    defaultValue={item.physical}
                    placeholder={item.status === "pending" ? "Enter qty" : ""}
                    className={`w-24 text-center px-3 py-1.5 rounded-md border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-200 ${
                      item.status === "match" ? "bg-slate-50 border-slate-200 text-slate-700" :
                      item.status === "mismatch" ? "bg-red-50 border-red-200 text-red-600" :
                      "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
          <div>Showing 1-4 of 350 items</div>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="text-slate-400 border-none" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="bg-black text-white hover:bg-black hover:text-white rounded-md">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="text-slate-600 border-none">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="text-slate-600 border-none" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
