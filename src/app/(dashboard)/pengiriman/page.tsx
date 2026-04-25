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
import { 
  Plus, 
  Printer, 
  MapPin, 
  Truck,
  ChevronDown
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PengirimanPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengiriman</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track your fashion logistics.
          </p>
        </div>
        <Button className="bg-black text-white hover:bg-black/80">
          <Plus className="mr-2 h-4 w-4" /> New Shipment
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-full">
              <button className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded-full">All</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-full">Dalam Perjalanan</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-full">Terkirim</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-full">Tertunda</button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 font-medium text-slate-900 border px-3 py-1.5 rounded-md bg-white">
                Date (Newest) <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Kode Barang</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Tanggal Pengiriman</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-400">Alamat Tujuan</TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "TRK-2023-8901",
                    date: "24 Oct 2023",
                    address: "Jl. Sudirman Kav 52-53\nJakarta Selatan, 12190",
                    status: "Dalam Perjalanan",
                    statusColor: "text-blue-600 bg-blue-50 border-blue-200",
                    active: true,
                  },
                  {
                    id: "TRK-2023-8895",
                    date: "23 Oct 2023",
                    address: "Plaza Indonesia Lt. 3\nJakarta Pusat, 10350",
                    status: "Terkirim",
                    statusColor: "text-green-600 bg-green-50 border-green-200",
                    active: false,
                  },
                  {
                    id: "TRK-2023-8872",
                    date: "22 Oct 2023",
                    address: "Jl. Merdeka No. 45\nBandung, 40111",
                    status: "Belum Dikirim",
                    statusColor: "text-slate-600 bg-slate-100 border-slate-200",
                    active: false,
                  },
                  {
                    id: "TRK-2023-8850",
                    date: "20 Oct 2023",
                    address: "Pakuwon Mall GF\nSurabaya, 60213",
                    status: "Tertunda",
                    statusColor: "text-red-600 bg-red-50 border-red-200",
                    active: false,
                  },
                ].map((item) => (
                  <TableRow key={item.id} className={`border-slate-50 cursor-pointer ${item.active ? 'bg-slate-50/80 hover:bg-slate-50/80' : 'hover:bg-slate-50/50'}`}>
                    <TableCell className="font-mono text-xs font-bold text-slate-700 align-top py-4">
                      {item.id.split('-').map((part, i) => <div key={i}>{part}{i < 2 ? '-' : ''}</div>)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 align-top py-4">
                      {item.date.split(' ').map((part, i) => <div key={i}>{part}</div>)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 whitespace-pre-line py-4">
                      {item.address}
                    </TableCell>
                    <TableCell className="text-right align-top py-4">
                      <span className={`inline-flex items-center justify-center text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border ${item.statusColor}`}>
                        {item.status === 'Dalam Perjalanan' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>}
                        {item.status === 'Terkirim' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600"></span>}
                        {item.status === 'Tertunda' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>}
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
              <div>Showing 1-4 of 124 entries</div>
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
                    <PaginationLink href="#" className="text-slate-600 border-none">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="text-slate-600 border-none" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Card>
        </div>

        {/* Right Column: Tracking Details */}
        <div className="lg:col-span-1">
          <Card className="border-slate-100 shadow-sm rounded-xl bg-white p-6 sticky top-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Tracking Details</h3>
                <p className="font-mono text-sm font-bold text-slate-900 mt-1">TRK-2023-8901</p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                <Printer className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Placeholder */}
            <div className="bg-slate-100 rounded-lg aspect-[4/3] mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m14.14 14.14 5.66-5.66M8.46 8.46 2.8 2.8M14.14 8.46l5.66 5.66M8.46 14.14l-5.66 5.66M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Destination</h4>
                  <p className="text-sm font-medium text-slate-900 mt-1">Jl. Sudirman Kav 52-53,<br/>Jakarta Selatan, 12190</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Carrier</h4>
                  <p className="text-sm font-medium text-slate-900 mt-1">Vogue Express Logistics</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Tracking Timeline</h4>
              <div className="relative pl-4 pt-2 space-y-6 before:absolute before:inset-y-2 before:left-[3px] before:w-px before:bg-slate-200">
                {[
                  { title: "Paket sedang dalam perjalanan ke hub Jakarta Pusat", time: "24 Oct 2023, 14:30 WIB", active: true },
                  { title: "Paket telah berangkat dari Gudang Utama", time: "24 Oct 2023, 08:15 WIB" },
                  { title: "Paket telah diproses dan siap dikirim", time: "23 Oct 2023, 16:45 WIB" },
                  { title: "Pesanan dibuat", time: "23 Oct 2023, 10:20 WIB" },
                  { title: "Pembayaran telah dikonfirmasi", time: "23 Oct 2023, 10:05 WIB" },
                  { title: "Menunggu pembayaran", time: "23 Oct 2023, 09:50 WIB" },
                ].map((event, i) => (
                  <div key={i} className="relative">
                    <span className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white ${event.active ? 'bg-black' : 'bg-slate-300'}`}></span>
                    <p className={`text-sm ${event.active ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
