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
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Search, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function DataBarangPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Barang</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track your apparel inventory catalog.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-slate-600 bg-white border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-black text-white hover:bg-black/80">
            <Plus className="mr-2 h-4 w-4" /> New Item
          </Button>
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
              placeholder="Search by name or code..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-200"
            />
          </div>
          <Button variant="outline" className="text-slate-600">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[100px] text-xs font-bold uppercase tracking-widest text-slate-400">Foto Barang</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Kode Barang</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Nama Barang</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Stok</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "VOG-001",
                name: "Ivory Silk Blouse",
                sub: "Silk Collection",
                stock: 142,
                status: "Available",
                statusColor: "text-green-600 bg-green-50 border-green-200",
                imgBg: "bg-orange-100",
              },
              {
                id: "VOG-002",
                name: "Oversized Denim Jacket",
                sub: "Outerwear",
                stock: 12,
                status: "Low Stock",
                statusColor: "text-orange-600 bg-orange-50 border-orange-200",
                imgBg: "bg-blue-100",
              },
              {
                id: "VOG-003",
                name: "Cashmere Turtleneck",
                sub: "Knitwear",
                stock: 0,
                status: "Out of Stock",
                statusColor: "text-red-600 bg-red-50 border-red-200",
                imgBg: "bg-slate-100",
              },
              {
                id: "VOG-004",
                name: "Tailored Pleated Trousers",
                sub: "Bottoms",
                stock: 65,
                status: "Available",
                statusColor: "text-green-600 bg-green-50 border-green-200",
                imgBg: "bg-stone-100",
              },
            ].map((item, i) => (
              <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50">
                <TableCell>
                  <div className={`w-12 h-12 rounded-md ${item.imgBg} flex items-center justify-center overflow-hidden`}>
                     {/* Placeholder for clothes image */}
                     <div className="w-6 h-8 bg-black/10 rounded-sm"></div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{item.id}</TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.sub}</div>
                </TableCell>
                <TableCell className="text-sm text-slate-700">{item.stock}</TableCell>
                <TableCell>
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
          <div>Showing 1 to 10 of 245 entries</div>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="text-slate-400" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="bg-black text-white hover:bg-black hover:text-white">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="text-slate-600">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="text-slate-600">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="text-slate-600" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
