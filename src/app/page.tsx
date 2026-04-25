import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Box, Truck, RotateCcw } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">VogueManage</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="#product" className="hover:text-slate-900 transition-colors">Product</Link>
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-slate-900 transition-colors">Testimonials</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button className="rounded-full px-6 bg-black text-white hover:bg-black/80">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-8 pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Precision Fashion Management
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-slate-900">
                Manage Your Clothing Inventory <br className="hidden md:block"/> with Ease
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Experience the perfect blend of editorial aesthetics and rigorous operational functionality. Streamline your supply chain, track stock levels in real-time, and manage returns with unparalleled precision and speed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login">
                  <Button size="lg" className="rounded-md px-8 h-12 bg-black text-white hover:bg-black/80 font-medium">
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-md px-8 h-12 font-medium border-slate-200 hover:bg-slate-50 text-slate-600">
                  Request Demo
                </Button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative bg-[#f5f5f5] rounded-3xl p-8 flex items-center justify-center aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden">
              {/* Replace with actual knitted shirt image */}
              <div className="relative w-full h-full min-h-[300px]">
                 <Image 
                  src="/images/baju-rajut.png" 
                  alt="Knitted Shirt Polo" 
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-700 ease-in-out"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Curated Inventory View Section */}
        <section id="product" className="px-8 py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Curated Inventory View</h2>
              <p className="text-slate-500">Visually manage your collections with our high-fidelity grid interface.</p>
            </div>
            
            <div className="grid md:grid-cols-12 gap-6">
              {/* Large item */}
              <div className="md:col-span-8 group cursor-pointer">
                <div className="bg-[#fcfafa] rounded-2xl p-6 h-[400px] flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="flex justify-end z-10">
                    <span className="bg-white/80 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full border shadow-sm">Low Stock</span>
                  </div>
                  {/* Decorative placeholder for dress */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-multiply transition-transform duration-500 group-hover:scale-105">
                     <div className="w-[60%] h-[80%] bg-gradient-to-b from-orange-100 to-orange-200 rounded-t-full shadow-inner relative overflow-hidden">
                        <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-orange-300/40 blur-md"></div>
                        <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-red-300/30 blur-xl"></div>
                     </div>
                  </div>
                  <div className="z-10 mt-auto bg-white/90 backdrop-blur p-4 rounded-xl border border-slate-100/50 flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-slate-900">Aura Silk Slip Dress</h3>
                      <p className="text-xs text-slate-500 mt-1">Evening Wear Collection</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">SKU: DR-002</span>
                  </div>
                </div>
              </div>

              {/* Two small items */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="bg-[#f4f6f8] rounded-2xl p-5 flex-1 flex flex-col border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
                   {/* Decorative placeholder for blazer */}
                  <div className="absolute inset-x-0 top-0 h-[60%] flex items-end justify-center opacity-90 transition-transform duration-500 group-hover:scale-105">
                     <div className="w-[70%] h-[120%] bg-slate-700 rounded-t-xl shadow-lg flex justify-center">
                        <div className="w-1 h-full bg-slate-800"></div>
                     </div>
                  </div>
                  <div className="mt-auto z-10 bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-sm text-slate-900">Tailored Wool Blazer</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-slate-500">48 in stock</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#f8f8f8] rounded-2xl p-5 flex-1 flex flex-col border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
                  {/* Decorative placeholder for shirt */}
                  <div className="absolute inset-x-0 top-0 h-[60%] flex items-center justify-center opacity-80 transition-transform duration-500 group-hover:scale-105">
                     <div className="w-[80%] h-[80%] bg-white border rounded-md shadow-sm flex flex-col items-center py-2">
                       <div className="w-8 h-2 border-b"></div>
                       <div className="w-1 h-full border-l border-dashed mt-2"></div>
                     </div>
                  </div>
                  <div className="mt-auto z-10 bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-sm text-slate-900">Essential Cotton Poplin</h3>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                      <div className="w-[85%] h-full bg-black rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-right text-slate-400 mt-1 uppercase font-medium">Optimal Level</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Fashion Logistics */}
        <section id="features" className="px-8 py-24 bg-[#fafafa]">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for Fashion Logistics</h2>
            <p className="text-slate-500">
              Powerful tools designed specifically for the nuanced needs of apparel management, ensuring every piece is tracked from warehouse to wardrobe.
            </p>
          </div>
          
          <div className="container mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
            <Card className="p-8 border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mb-6">
                <Box className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold mb-3">Inventory Tracking</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Real-time SKU-level visibility. Monitor stock across multiple warehouses, track variations in sizing and colorways effortlessly.
              </p>
            </Card>
            
            <Card className="p-8 border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mb-6">
                <Truck className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold mb-3">Shipment Management</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Streamline your dispatch process. Generate manifests, track carrier status, and automate customer notifications in one dashboard.
              </p>
            </Card>

            <Card className="p-8 border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mb-6">
                <RotateCcw className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold mb-3">Returns Control</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                A rigorous QA and restocking workflow. Inspect returned items, categorize conditions, and quickly reintegrate viable stock.
              </p>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="px-8 py-32 bg-white text-center">
          <div className="container mx-auto max-w-3xl flex flex-col items-center">
            <span className="text-6xl text-slate-200 font-serif leading-none mb-4">"</span>
            <p className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed mb-10">
              VogueManage transformed our chaotic stockroom into a streamlined operation. The interface is exceptionally clean, allowing our team to focus on the clothes rather than fighting the software. It's the operational backbone our brand needed.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                {/* Random profile picture placeholder */}
                <img src="https://i.pravatar.cc/150?u=elena" alt="Elena Rostova" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-900">Elena Rostova</h4>
                <p className="text-xs text-slate-500">Operations Director, Maison Minimal</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#fafafa] py-12 px-8 border-t border-slate-100">
        <div className="container mx-auto max-w-6xl flex flex-col items-center text-center space-y-8">
          <span className="text-xl font-bold tracking-tight text-slate-900">VogueManage</span>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <Link href="#" className="hover:text-slate-900 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-8">
            © 2024 Voguemanage Systems. Precision in Fashion Management.
          </p>
        </div>
      </footer>
    </div>
  );
}
