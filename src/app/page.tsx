"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Box, Truck, RotateCcw, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans overflow-x-hidden relative">
      {/* Floating Blobs for "Cute" factor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary/15 rounded-full blur-[80px] animate-bounce duration-[10s]"></div>
      <div className="absolute top-[40%] right-[10%] w-[15%] h-[15%] bg-accent/20 rounded-full blur-[60px]"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/40 backdrop-blur-xl border-b border-primary/5">
        <div className="container mx-auto max-w-6xl flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-10 w-10 bg-gradient-to-tr from-primary to-secondary rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">Q</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
              QueenyLook
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-muted-foreground/80">
            <Link href="#tentang" className="hover:text-primary hover:scale-105 transition-all">Tentang Kami</Link>
            <Link href="#kualitas" className="hover:text-secondary hover:scale-105 transition-all">Kualitas</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button className="rounded-2xl px-8 bg-primary text-primary-foreground hover:scale-105 transition-all shadow-xl shadow-primary/25 font-black text-sm uppercase tracking-widest h-12">
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="px-8 pt-6 pb-20 md:pt-10 md:pb-24">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 bg-white/80 border border-primary/10 px-4 py-1.5 rounded-full shadow-sm">
                   <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                   <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Handmade with Love</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-foreground">
                  Rajutan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient italic">Cantik</span> <br/>
                  Untuk Kamu.
                </h1>
              </div>
              
              <p className="text-xl text-muted-foreground/90 leading-relaxed max-w-lg font-medium">
                Temukan kehangatan dalam setiap helai benang. Koleksi <span className="text-primary font-bold">QueenyLook</span> hadir dengan warna-warna pastel yang ceria dan material super lembut.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link href="/login">
                  <Button size="lg" className="rounded-[2rem] px-12 h-16 bg-primary text-primary-foreground hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all font-black text-xl shadow-xl shadow-primary/20">
                    Mulai Eksplorasi
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-[2rem] px-12 h-16 font-black text-xl border-secondary/30 hover:bg-secondary/10 text-secondary border-2 transition-all">
                  Cek Katalog
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative group">
              {/* Decorative blob behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[4rem] rotate-3 group-hover:rotate-6 transition-transform duration-700"></div>
              
              <div className="relative bg-white rounded-[3.5rem] p-6 shadow-2xl border border-white/50 aspect-square overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <Image
                    src="/images/baju-rajut.png"
                    alt="Koleksi Rajut QueenyLook"
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-1000 ease-out"
                    priority
                  />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-primary/10 rotate-12">
                   <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Terlembut!</p>
                   <p className="text-sm font-bold">100% Premium Cotton</p>
                </div>
              </div>

              {/* Floating Info Card */}
              <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] border border-secondary/10 shadow-2xl max-w-[280px] transform hover:scale-105 transition-transform">
                 <div className="flex gap-4 items-center mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                       <Box className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                       <h3 className="font-black text-foreground">Signature Cardigan</h3>
                       <p className="text-xs text-muted-foreground font-bold">Best Seller of the Month</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1.5 flex-1 rounded-full bg-primary/20">
                        <div className="h-full bg-primary rounded-full w-full animate-pulse" style={{animationDelay: `${i*100}ms`}}></div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why QueenyLook */}
        <section id="kualitas" className="px-8 py-32 bg-white/50 backdrop-blur-sm relative">
          <div className="container mx-auto max-w-4xl text-center mb-24">
            <div className="inline-block px-6 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-widest mb-6">
              Mengapa Pilih Kami?
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
              Dibuat Spesial Untuk <br/> <span className="text-primary italic underline decoration-secondary/30 underline-offset-8">Kenyamananmu</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Kami tidak hanya membuat baju, kami merajut kebahagiaan di setiap detailnya.
            </p>
          </div>

          <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-10">
            {[
              { title: "Bahan Premium", desc: "Benang rajut kualitas terbaik yang sangat lembut dan tidak gatal.", icon: Box, color: "primary" },
              { title: "Desain Lucu", desc: "Model-model yang up-to-date dan pilihan warna pastel yang menggemaskan.", icon: Truck, color: "secondary" },
              { title: "Garansi Puas", desc: "Kami menjamin kepuasanmu dengan kualitas jahitan dan rajutan kami.", icon: RotateCcw, color: "accent" }
            ].map((feature, idx) => (
              <Card key={idx} className="p-12 border-none shadow-2xl shadow-primary/5 rounded-[3rem] bg-white hover:-translate-y-4 transition-all duration-500 group">
                <div className={`h-20 w-20 rounded-[2rem] bg-${feature.color}/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <feature.icon className={`h-10 w-10 text-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-black mb-4 text-foreground">{feature.title}</h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="tentang" className="px-8 py-32 text-center overflow-hidden">
          <div className="container mx-auto max-w-3xl relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <span className="text-[12rem] text-primary/10 font-serif leading-none absolute -top-16 left-1/2 -translate-x-1/2 select-none">“</span>
            <p className="text-3xl md:text-4xl font-black text-foreground leading-tight tracking-tighter mb-16 relative z-10 italic">
              "Kardigan QueenyLook itu beneran <span className="text-primary">selembut awan!</span> Warnanya lucu-lucu banget, bikin mood naik setiap kali pake. Langganan banget deh!"
            </p>
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] p-1 bg-gradient-to-tr from-primary to-secondary shadow-2xl">
                <div className="h-full w-full rounded-[1.8rem] overflow-hidden border-4 border-white">
                  <img
                    src="https://i.pravatar.cc/150?u=sara"
                    alt="Sara Wijaya"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-black text-2xl text-foreground">Sara Wijaya</h4>
                <p className="text-sm text-secondary font-black uppercase tracking-[0.2em] mt-1">Fashion Lover</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-20 px-8 border-t border-primary/10 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-tr from-primary to-secondary rounded-xl rotate-6 flex items-center justify-center">
                  <span className="text-white font-black text-sm">Q</span>
                </div>
                <span className="text-3xl font-black tracking-tighter text-primary">
                  QueenyLook
                </span>
              </div>
              <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">
                Membawa kehangatan dan keceriaan lewat setiap helai benang rajut terbaik untukmu.
              </p>
              <div className="flex gap-5">
                {['Instagram', 'WhatsApp', 'TikTok'].map((social) => (
                  <Link key={social} href="#" className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:-translate-y-1 shadow-lg shadow-primary/5">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-current opacity-50"></div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-foreground uppercase tracking-[0.3em] text-xs">Navigasi</h4>
              <nav className="flex flex-col gap-5 text-lg text-muted-foreground font-bold">
                <Link href="#tentang" className="hover:text-primary transition-colors">Tentang Kami</Link>
                <Link href="#kualitas" className="hover:text-secondary transition-colors">Kualitas</Link>
                <Link href="#" className="hover:text-accent transition-colors">Kontak</Link>
              </nav>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-foreground uppercase tracking-[0.3em] text-xs">Informasi</h4>
              <nav className="flex flex-col gap-5 text-lg text-muted-foreground font-bold">
                <Link href="#" className="hover:text-primary transition-colors">Pengiriman</Link>
                <Link href="#" className="hover:text-secondary transition-colors">Retur Produk</Link>
                <Link href="#" className="hover:text-accent transition-colors">Syarat & Ketentuan</Link>
              </nav>
            </div>
          </div>
          <div className="pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-sm text-muted-foreground font-black uppercase tracking-widest">
              © 2024 QueenyLook. Made with 💖 in Indonesia.
            </p>
            <div className="flex gap-8 text-sm text-muted-foreground font-black uppercase tracking-widest">
               <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Jakarta, ID
               </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for custom animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
